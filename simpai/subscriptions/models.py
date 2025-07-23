from django.db import models
from django.conf import settings
from django.contrib.auth.models import Group, Permission
from django.db.models.signals import post_save
from django.dispatch import receiver
from django.urls import reverse
from django.utils import timezone
import datetime
import helpers.billing
from django.db.models import Q
from django.contrib.auth.models import AbstractUser

User = settings.AUTH_USER_MODEL

ALLOW_CUSTOM_GROUPS= True

class UserSubscriptionQuerySet(models.QuerySet):
    def by_range(self, days_start=7, days_end=120, verbose=True):
        now = timezone.now()
        days_start_from_now = now + datetime.timedelta(days=days_start)
        days_end_from_now = now + datetime.timedelta(days=days_end)
        range_start = days_start_from_now.replace(hour=0, minute=0, second=0, microsecond=0)
        range_end = days_end_from_now.replace(hour=23, minute=59, second=59, microsecond=59)
        if verbose:
            print(f"Range is {range_start} to {range_end}")
        return self.filter(
            current_period_end__gte=range_start,
            current_period_end__lte=range_end
        )
    
    def by_days_left(self, days_left=7):
        now = timezone.now()
        in_n_days = now+datetime.timedelta(days=days_left)
        days_start = in_n_days.replace(hour=0, minute=0, second=0, microsecond=0)
        days_end = in_n_days.replace(hour=23, minute=59, second=59, microsecond=59)
        return self.filter(
            current_period_end__gte=days_start,
            current_period_end__lte=days_end
            )
    
    def by_days_ago(self, days_ago=3):
        now = timezone.now()
        in_n_days = now-datetime.timedelta(days=days_ago)
        days_start = in_n_days.replace(hour=0, minute=0, second=0, microsecond=0)
        days_end = in_n_days.replace(hour=23, minute=59, second=59, microsecond=59)
        return self.filter(
            current_period_end__gte=days_start,
            current_period_end__lte=days_end
            )

    def by_active_trialing(self):
        active_qs_lookup = (
            Q(status=SubscriptionStatus.ACTIVE) |
            Q(status=SubscriptionStatus.TRIALING)
        )
        return self.filter(active_qs_lookup)
    
    def by_user_ids(self, user_ids=None):
        qs=self
        if isinstance(user_ids, list):
            qs=self.filter(user_id__in=user_ids)
        elif isinstance(user_ids, int):
            qs=self.filter(user_id__in=[user_ids])
        elif isinstance(user_ids, str):
            qs = self.filter(user_id__in=[user_ids])
        return qs

class SubscriptionStatus(models.TextChoices):
    ACTIVE = 'active', 'Active'
    TRIALING = 'trialing', 'Trialing'
    INCOMPLETE = 'incomplete', 'Incomplete'
    INCOMPLETE_EXPIRED = 'incomplete_expired', 'Incomplete Expired'
    PAST_DUE = 'past_due', 'Past Due'
    CANCELED = 'canceled', 'Canceled'
    UNPAID = 'unpaid', 'Unpaid'
    PAUSED = 'paused', 'Paused'

class SubscriptionPrice(models.Model):
    class IntervalChoices(models.TextChoices):
        MONTHLY = 'month', 'Monthly'
        YEARLY = 'year', 'Annually'

    name = models.CharField(max_length=120, default='Subscription')
    paystack_id = models.CharField(max_length=255, null=True, blank=True)
    interval = models.CharField(max_length=120, default=IntervalChoices.MONTHLY, choices=IntervalChoices.choices)
    price = models.DecimalField(max_digits=10, decimal_places=2, default=19.99)
    #trial_period_days = models.IntegerField(default=7, help_text='Number of days for the free trial')
    order = models.IntegerField(default=-1, help_text='Order on pricing page')
    featured = models.BooleanField(default=True, help_text='Featured on pricing page')
    updated = models.DateTimeField(auto_now=True)
    timestamp = models.DateTimeField(auto_now_add=True)
    groups = models.ManyToManyField(Group, blank=True)
    active = models.BooleanField(default=True)

    def __str__(self):
        return f"{self.name} ({self.interval})"
    class Meta:
        ordering = ['order', 'featured', '-updated']

    def get_checkout_url(self):
        return reverse("sub-price-checkout",
            kwargs={"price_id": self.id})
    
    @property
    def stripe_currency(self):
        return 'USD'
    @property
    def stripe_price(self):
        """remove decs"""
        return int(self.price * 100)

    @property
    def product_paystack_id(self):
        if not self.paystack_id:
            return None
        return self.paystack_id
    
    def save(self, *args, **kwargs):
    # First save to ensure we have an ID
        super().save(*args, **kwargs)
        
        if not self.paystack_id:
            try:
                from helpers.billing import PaystackService
                import requests
                
                url = f"{PaystackService.BASE_URL}/plan"
                headers = PaystackService._get_headers()
                
                response = requests.post(
                    url,
                    headers=headers,
                    json={
                        "name": self.name,
                        "amount": int(float(self.price) * 100),
                        "interval": "monthly" if self.interval == "month" else "annually",
                        "currency": "USD"  # Change to NGN if needed
                    }
                )
                response.raise_for_status()
                
                plan_code = response.json()['data']['plan_code']
                self.paystack_id = plan_code
                # Use update to avoid recursive save
                SubscriptionPrice.objects.filter(id=self.id).update(paystack_id=plan_code)
                
            except Exception as e:
                print(f"CRITICAL ERROR CREATING PLAN: {str(e)}")
                if hasattr(e, 'response'):
                    print(f"API RESPONSE: {e.response.text}")

class UserSubscriptionManager(models.Manager):
    def get_queryset(self):
        return UserSubscriptionQuerySet(self.model, using=self._db)

class UserSubscription(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE)
    subscription_price = models.ForeignKey(SubscriptionPrice, on_delete=models.SET_NULL, null=True, blank=True)
    paystack_id = models.CharField(max_length=120, null=True, blank=True)
    subscription_code = models.CharField(max_length=120, null=True, blank=True)  # This stores SUB_xxx
    customer_code = models.CharField(max_length=120, null=True, blank=True)
    last_payment_reference = models.CharField(max_length=100, blank=True, null=True) 
    
    active = models.BooleanField(default=True)
    user_cancelled = models.BooleanField(default=False)
    original_period_start = models.DateTimeField(auto_now=False, auto_now_add=False, blank=True, null=True)
    current_period_start = models.DateTimeField(auto_now=False, auto_now_add=False, blank=True, null=True)
    current_period_end = models.DateTimeField(auto_now=False, auto_now_add=False, blank=True, null=True)
    cancel_at_period_end = models.BooleanField(default=False)
    status = models.CharField(max_length=20, choices=SubscriptionStatus.choices, null=True, blank=True)

    objects = UserSubscriptionManager()
    

    def __str__(self):
        return f"{self.user.email} - {self.subscription_price}"
    
    def get_absolute_url(self):
        return reverse("user_subscription")
    
    def get_cancel_url(self):
        return reverse("user_subscription_cancel")

    @property
    def is_active_status(self):
        return self.status in [SubscriptionStatus.ACTIVE, SubscriptionStatus.TRIALING]

    @property
    def plan_name(self):
        if not self.subscription_price:
            return None
        return self.subscription_price.name
    
    def serialize(self):
        return{
            "Plan_name": self.plan_name,
            "status": self.status,
            "current_period_start": self.current_period_start,
            "current_period_end": self.current_period_end,
        }
    
    @property
    def billing_cycle_anchor(self):
        """
        https://docs.stripe.com/payments/checkout/billing-cycle
        Optional delay to start new subscription in
        Stripe checkout
        """
        if not self.current_period_end:
            return None
        return int(self.current_period_end.timestamp())

    def save(self, *args, **kwargs):
        if self.original_period_start is None and self.current_period_start is not None:
            self.original_period_start = self.current_period_start
        super().save(*args, **kwargs)

def user_sub_post_save(sender, instance, *args, **kwargs):
    user_sub_instance = instance
    user = user_sub_instance.user
    subscription_price_obj = user_sub_instance.subscription_price
    groups_ids = []
    
    if subscription_price_obj is not None:
        # Assuming you have a ManyToManyField for groups in SubscriptionPrice
        groups = subscription_price_obj.groups.all()
        groups_ids = groups.values_list('id', flat=True)
    
    if not ALLOW_CUSTOM_GROUPS:
        user.groups.set(groups_ids)
    else:
        subs_qs = SubscriptionPrice.objects.filter(active=True)
        if subscription_price_obj is not None:
            subs_qs = subs_qs.exclude(id=subscription_price_obj.id)
        
        subs_groups = subs_qs.values_list("groups__id", flat=True)
        subs_groups_set = set(subs_groups)
        
        current_groups = user.groups.all().values_list('id', flat=True)
        groups_ids_set = set(groups_ids)
        current_groups_set = set(current_groups) - subs_groups_set
        final_group_ids = list(groups_ids_set | current_groups_set)
        
        user.groups.set(final_group_ids)

post_save.connect(user_sub_post_save, sender=UserSubscription)