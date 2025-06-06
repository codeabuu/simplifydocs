from django.core.management.base import BaseCommand
from customers.models import Customer
from subscriptions.models import UserSubscription, SubscriptionStatus, UserSubscriptionQuerySet
import helpers.billing
from django.db.models import Q


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
        if obj.stripe_id:
            sub_data = helpers.billing.get_subscription(obj.stripe_id, raw=False)
            for k, v in sub_data.items():
                setattr(obj, k, v)
            obj.save()
            complete_count += 1
    return complete_count == qs_count

def clear_dangling_subs():
    qs = Customer.objects.filter(stripe_id__isnull=False)
    for customer_obj in qs:
        user = customer_obj.user
        customer_stripe_id = customer_obj.stripe_id
        print(f"sync {user} - {customer_stripe_id} subs and remove old ones")
        subs = helpers.billing.get_customer_active_subscription(customer_stripe_id)
        for sub in subs:
            existing_user_subs_qs  = UserSubscription.objects.filter(stripe_id__iexact=f'{sub.id}'.strip())
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