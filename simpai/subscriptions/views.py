from django.shortcuts import render, redirect
import helpers.billing
from helpers.billing import PaystackService
from helpers.date_utils import timestamp_as_datetime
from django.contrib.auth.decorators import login_required
from subscriptions.models import SubscriptionPrice, UserSubscription, SubscriptionStatus
from subscriptions import utils as sub_utils
from django.urls import reverse
from django.contrib import messages
from django.http import JsonResponse
import datetime
import logging
from .utils import update_subscription_from_transaction, calculate_period_end

logger = logging.getLogger(__name__)

@login_required
def user_subscription_view(request):
    user_sub_obj, created = UserSubscription.objects.get_or_create(user=request.user)
    if request.method == "POST":
        print("refresh subscription")
        finished = sub_utils.refresh_active_users_subscriptions(user_ids=[request.user.id], active_only=False)
        if finished:
            messages.success(request, "Plan details refreshed succesfully")
        else:
            messages.error(request, "warning, plan details not refreshed")

        return redirect(user_sub_obj.get_absolute_url())
    return render(request, "subscriptions/user_detail_view.html", {"subscription": user_sub_obj})

@login_required
def user_subscription_cancel_view(request):
    user_sub_obj, created = UserSubscription.objects.get_or_create(user=request.user)
    if request.method == 'POST':
        if user_sub_obj.paystack_id and user_sub_obj.is_active_status:
            sub_data = helpers.billing.cancel_subscription(user_sub_obj.paystack_id, reason='sub expired or user terminated', cancel_at_period_end=True, raw=False)
            for k, v in sub_data.items():
                setattr(user_sub_obj, k, v)
            user_sub_obj.save()
            messages.success(request, "Your plan has been canceled succesfully")
        return redirect(user_sub_obj.get_absolute_url())
    return render(request, 'subscriptions/user_cancel_view.html', {'subscription': user_sub_obj})

def subscription_price_view(request, interval="month"):
    prices = SubscriptionPrice.objects.all()
    prices_data = list(prices.values('id', 'name', 'price', 'interval'))
    return JsonResponse(prices_data, safe=False)


from rest_framework.decorators import permission_classes, api_view
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from helpers import date_utils
from django.utils import timezone


@api_view(["GET"])
@permission_classes([IsAuthenticated])
def verify_checkout_payment(request):
    reference = request.GET.get("reference")
    if not reference:
        return Response({"error": "Missing reference"}, status=400)

    try:
        # Verify transaction with Paystack
        transaction = helpers.billing.verify_transaction(reference)
        if not transaction.get("is_successful", False):
            return Response({
                "error": "Payment verification failed",
                "details": transaction
            }, status=400)

        # Use your existing utility function
        user_sub = update_subscription_from_transaction(
            user=request.user,
            transaction_data=transaction.get("data", {})
        )

        # Additional fields not covered by utils
        user_sub.last_payment_reference = reference
        user_sub.save()

        return Response({
            "message": "Subscription verified and updated",
            "status": user_sub.status,
            "period_end": user_sub.current_period_end,
            "reference": reference
        })

    except Exception as e:
        logger.error(f"Payment verification error: {str(e)}", exc_info=True)
        return Response({
            "error": "An error occurred during verification",
            "details": str(e)
        }, status=500)

from django.core.exceptions import ObjectDoesNotExist

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def check_subscription_status(request):
    try:
        # Check local record first
        try:
            sub = UserSubscription.objects.get(user=request.user)
            # Verify with Paystack
            paystack_data = PaystackService.get_subscription(sub.subscription_code)
            if paystack_data.get('status') in ['active', 'trialing']:
                return Response({"is_subscribed": True, "source": "local_verified"})
        except UserSubscription.DoesNotExist:
            pass

        # Fallback to transaction check
        transactions = PaystackService.get_customer_transactions(request.user.email)
        latest_success = next(
            (tx for tx in sorted(transactions, key=lambda x: x['created_at'], reverse=True) 
            if tx['status'] == 'success' and tx.get('plan')), None)
        
        if latest_success:
            PaystackService.handle_subscription_event({
                'data': {
                    'subscription_code': latest_success.get('subscription', {}).get('subscription_code'),
                    'customer': latest_success.get('customer', {})
                }
            })
            return Response({"is_subscribed": True, "source": "transaction_sync"})
            
        return Response({"is_subscribed": False})
        
    except Exception as e:
        logger.error(f"Subscription check error: {str(e)}")
        return Response({"error": str(e)}, status=500)