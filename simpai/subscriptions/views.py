from django.shortcuts import render, redirect
import helpers.billing
from django.contrib.auth.decorators import login_required
from subscriptions.models import SubscriptionPrice, UserSubscription
from subscriptions import utils as sub_utils
from django.urls import reverse
from django.contrib import messages
from django.http import JsonResponse

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
        if user_sub_obj.stripe_id and user_sub_obj.is_active_status:
            sub_data = helpers.billing.cancel_subscription(user_sub_obj.stripe_id, reason='sub expired or user terminated', cancel_at_period_end=True, raw=False)
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

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def check_subscription_status(request):
    try:
        user_sub = UserSubscription.objects.get(user=request.user)
        is_active = user_sub.is_active_status and not user_sub.user_cancelled
        return Response({
            'has_active_subscription': is_active,
            'subscription_data': user_sub.serialize()
        })
    except UserSubscription.DoesNotExist:
        return Response({
            'has_active_subscription': False,
            'subscription_data': None
        })