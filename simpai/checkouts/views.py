from django.db import models
from django.contrib.auth.decorators import login_required
from django.shortcuts import redirect, render
from subscriptions.models import SubscriptionPrice, UserSubscription, SubscriptionStatus
import helpers.billing
from django.urls import reverse
from django.conf import settings
from django.contrib.auth import get_user_model
from django.http import HttpResponseBadRequest
from django.contrib import messages
import datetime
from decouple import config
from django.shortcuts import get_object_or_404
from urllib.parse import quote
from rest_framework.permissions import IsAuthenticated
from rest_framework.decorators import permission_classes, api_view
from rest_framework.response import Response
from django.http import HttpResponseRedirect


User=get_user_model()
BASE_URL=settings.BASE_URL

from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt


@csrf_exempt
def product_price_redirect_view(request, price_id=None, *args, **kwargs):
    request.session['checkout_subscription_price_id'] = price_id
    return checkout_redirect_view(request)

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def checkout_redirect_view(request):
    try:
        price_id = request.session.get('checkout_subscription_price_id')
        print("DEBUG: Price ID from session:", price_id)
        if not price_id:
            return JsonResponse(
                {"error": "No subscription price selected"}, 
                status=400
            )

        price = get_object_or_404(SubscriptionPrice, id=price_id)
        print("DEBUG: Retrieved price:", price)
        print("DEBUG: Paystack ID:", price.paystack_id)

        if not price.paystack_id:
            return JsonResponse(
                {"error": "This plan is not properly configured with Paystack"},
                status=400
            )

        print("DEBUG: User email:", request.user.email)

        checkout_url = helpers.billing.start_checkout_session(
            email=request.user.email,
            plan_code=price.paystack_id,
            amount=price.price * 100,  # Paystack expects amount in kobo
            success_url=f"{settings.FRONTEND_URL}/subscription-success",
            metadata={"cancel_url": f"{BASE_URL}{reverse('pricing')}"}
        )

        print("DEBUG: Checkout URL received:", checkout_url)

        if not checkout_url:
            return JsonResponse(
                {"error": "Failed to initialize Paystack checkout"},
                status=500
            )

        return JsonResponse({"checkout_url": checkout_url})

    except Exception as e:
        import traceback
        traceback.print_exc()
        return JsonResponse(
            {"error": "Internal server error", "details": str(e)},
            status=500
        )


def checkout_finalize_view(request):
    reference = request.GET.get('reference')
    
    if not reference:
        return HttpResponseBadRequest("Missing payment reference")
    
    try:
        verification_data = helpers.billing.verify_transaction(reference)
        if not verification_data.get('status'):
            return HttpResponseBadRequest("Payment verification failed")
        
        # Extract all necessary data
        customer_email = verification_data['data']['customer']['email']
        plan_code = verification_data['data']['plan']['plan_code']
        subscription_code = verification_data['data'].get('subscription_code')
        status = verification_data['data'].get('status', 'active')
        
        # Get subscription period dates
        subscription_info = helpers.billing.get_subscription(subscription_code)
        
        # Prepare subscription data similar to Stripe version
        subscription_data = {
            'current_period_start': subscription_info.get('current_period_start'),
            'current_period_end': subscription_info.get('current_period_end'),
            'status': status,
            'cancel_at_period_end': False  # Paystack doesn't provide this by default
        }
        
        # Get related objects
        try:
            price_obj = SubscriptionPrice.objects.get(paystack_id=plan_code)
        except SubscriptionPrice.DoesNotExist:
            return HttpResponseBadRequest("Invalid subscription plan")
        
        try:
            user_obj = User.objects.get(email=customer_email)
        except User.DoesNotExist:
            return HttpResponseBadRequest("User not found")
        
        # Check for existing subscription
        updated_sub_options = {
            "subscription_price": price_obj,
            "paystack_id": subscription_code,
            "user_cancelled": False,
            **subscription_data,
        }
        
        try:
            user_sub_obj = UserSubscription.objects.get(user=user_obj)
            # Update existing subscription
            for key, value in updated_sub_options.items():
                setattr(user_sub_obj, key, value)
            user_sub_obj.save()
        except UserSubscription.DoesNotExist:
            # Create new subscription
            user_sub_obj = UserSubscription.objects.create(
                user=user_obj,
                **updated_sub_options
            )
        
        # Final verification
        if None in [user_obj, price_obj, user_sub_obj]:
            return HttpResponseBadRequest("Error with this account, please contact us!")
        
        subscription_type = "monthly" if price_obj.interval == "month" else "yearly"
        return HttpResponseRedirect(
            f"{settings.FRONTEND_URL}/subscription-success?type={subscription_type}"
        )
        
    except Exception as e:
        import traceback
        traceback.print_exc()
        return HttpResponseBadRequest(f"Processing error: {str(e)}")