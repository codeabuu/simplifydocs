from django.contrib import admin

# Register your models here.
from .models import *

class SubscriptionPrice(admin.StackedInline):
    model = SubscriptionPrice
    readonly_fields = ['paystack_id', 'price']
    can_delete = False
    extra = 0

class SubscriptionAdmin(admin.ModelAdmin):
    list_display = ('user', 'subscription_price_name', 'status', 'current_period_start')

    def subscription_price_name(self, obj):
        return obj.subscription_price.price if obj.subscription_price else None
    subscription_price_name.admin_order_field = 'subscription_price__name'  # Allow sorting by subscription price name


admin.site.register(UserSubscription, SubscriptionAdmin)