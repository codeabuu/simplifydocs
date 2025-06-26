from django.core.management.base import BaseCommand
from customers.models import Customer
from subscriptions.models import UserSubscription, SubscriptionStatus, UserSubscriptionQuerySet
import helpers.billing
from django.db.models import Q
from helpers import date_utils
from django.utils import timezone
import logging


logger = logging.getLogger(__name__)

def refresh_active_users_subscriptions(
        user_ids=None,
        active_only=True,
        days_ago=-1,
        days_left = -1,
        days_start = -1,
        days_end = -1,
        verbose=False
        ):
    qs = UserSubscription.objects.all()
    if active_only:
        qs = qs.by_active_trialing()
    if user_ids is not None:
        qs = qs.by_user_ids(user_ids=user_ids)
    if days_ago > -1:
        qs = qs.by_days_ago(days_ago=days_ago)
    if days_left > -1:
        qs = qs.by_days_left(days_left=days_left)
    if days_start > -1 and days_end > -1:
        qs = qs.by_range(days_start=days_start, days_end=days_end, verbose=verbose)
    complete_count = 0
    qs_count = qs.count()
    for obj in qs:
        if verbose:
            print("updating user", obj.user, obj.subscription, obj.current_period_end)
        if obj.paystack_id:
            sub_data = helpers.billing.get_subscription(obj.paystack_id, raw=False)
            for k, v in sub_data.items():
                setattr(obj, k, v)
            obj.save()
            complete_count += 1
    return complete_count == qs_count

def clear_dangling_subs():
    qs = Customer.objects.filter(paystack_id__isnull=False)
    for customer_obj in qs:
        user = customer_obj.user
        customer_paystack_id = customer_obj.paystack_id
        print(f"sync {user} - {customer_paystack_id} subs and remove old ones")
        subs = helpers.billing.get_customer_active_subscription(customer_paystack_id)
        for sub in subs:
            existing_user_subs_qs  = UserSubscription.objects.filter(paystack_id__iexact=f'{sub.id}'.strip())
            if existing_user_subs_qs.exists():
                continue
            helpers.billing.cancel_subscription(sub.id, reason="Dangling subs, not needed", cancel_at_period_end=True)
            print(sub.id, existing_user_subs_qs.exists())

def sysc_sub_group_permissions():
    qs = UserSubscription.objects.filter(active=True, status__in=[SubscriptionStatus.ACTIVE, SubscriptionStatus.TRIALING])
    for obj in qs:
        sub_perms = obj.permissions.all()
        for group in obj.groups.all():
            group.permissions.set(sub_perms)

def update_subscription_from_transaction(user, transaction_data):
    """
    Enhanced version with better error handling and field updates
    """
    try:
        customer_data = transaction_data.get("customer", {})
        plan_data = transaction_data.get("plan_object", {})
        paid_at = transaction_data.get("paid_at")
        
        # Get or create subscription
        user_sub, created = UserSubscription.objects.get_or_create(
            user=user,
            defaults={"status": SubscriptionStatus.UNPAID}
        )

        # Update core fields
        user_sub.customer_code = customer_data.get("customer_code")
        user_sub.subscription_code = transaction_data.get("subscription_code")
        user_sub.status = SubscriptionStatus.ACTIVE
        user_sub.paystack_id = transaction_data.get("id")  # Transaction ID
        
        # Handle payment date
        if paid_at:
            user_sub.current_period_start = date_utils.timestamp_as_datetime(paid_at)
            if created or not user_sub.original_period_start:
                user_sub.original_period_start = user_sub.current_period_start

        # Set period end based on plan
        interval = plan_data.get("interval", "monthly").lower()
        if user_sub.current_period_start:
            if interval == "monthly":
                user_sub.current_period_end = date_utils.add_months(
                    user_sub.current_period_start, 
                    1
                )
            elif interval == "annually":
                user_sub.current_period_end = date_utils.add_years(
                    user_sub.current_period_start, 
                    1
                )
            else:  # Fallback to 30 days
                user_sub.current_period_end = (
                    user_sub.current_period_start + 
                    timezone.timedelta(days=30)
                )

        user_sub.save()
        return user_sub

    except Exception as e:
        logger.error(f"Failed to update subscription: {str(e)}")
        raise  # Re-raise to handle in view

from datetime import timedelta, datetime
import pytz  # Optional: for setting UTC if needed

def calculate_period_end(transaction):
    """Calculate subscription end date based on Paystack transaction"""
    created_at_str = transaction['created_at']
    
    try:
        # Parse ISO 8601 datetime string
        if created_at_str.endswith('Z'):
            created_at_str = created_at_str.replace('Z', '+00:00')  # Ensure it's ISO8601-compliant
        start_date = datetime.fromisoformat(created_at_str)
    except Exception as e:
        print(f"Invalid created_at format: {e}")
        return None

    plan_interval = transaction.get('plan_object', {}).get('interval', 'monthly')
    
    if plan_interval == 'monthly':
        return start_date + timedelta(days=30)
    elif plan_interval == 'annually':
        return start_date + timedelta(days=365)
    
    # Default to 30 days if interval is unknown
    return start_date + timedelta(days=30)
