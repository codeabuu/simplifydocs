from django.shortcuts import render
from django.contrib.auth.hashers import make_password
from django.utils.crypto import get_random_string

# webhooks.py or views.py
from django.views.decorators.csrf import csrf_exempt
from django.http import JsonResponse
from django.conf import settings
import json
from subscriptions.models import UserSubscription, SubscriptionStatus, SubscriptionPrice
from django.utils import timezone
from helpers.billing import PaystackService
from customers.models import Customer
from django.contrib.auth import get_user_model

User=get_user_model()
random_password = get_random_string(12)

import logging
from traceback import format_exc

logger = logging.getLogger(__name__)

@csrf_exempt
def paystack_webhook(request):
    if request.method == 'POST':
        try:
            payload = json.loads(request.body)
            event = payload.get('event')
            logger.info(f"Received {event} event")

            if event in ['subscription.create', 'charge.success']:
                data = payload.get('data', {})
                customer_data = data.get('customer', {})
                email = customer_data.get('email')
                
                # 1. VALIDATE REQUIRED FIELDS
                required_fields = ['subscription_code', 'customer']
                if not all(field in data for field in required_fields):
                    error_msg = f'Missing required fields: {required_fields}'
                    logger.error(error_msg)
                    return JsonResponse({'error': error_msg}, status=400)

                # 2. GET OR CREATE USER
                try:
                    customer = Customer.objects.select_related('user').get(user__email=email)
                    user = customer.user
                except Customer.DoesNotExist:
                    logger.info(f"User {email} not found, creating...")
                    user, _ = User.objects.get_or_create(
                    email=email,
                    defaults={
                        "username": email,
                        "password": random_password
                    }
                )
                customer, _ = Customer.objects.get_or_create(
                    user=user,
                    defaults={
                        'init_email': email,
                        'paystack_id': customer_data.get('customer_code'),
                        'init_email_confirmed': True
                    }
                )

                # 3. HANDLE SUBSCRIPTION
                defaults = {
                    'user': user,
                    'customer_code': customer_data.get('customer_code'),
                    'status': data.get('status', SubscriptionStatus.ACTIVE),
                    'current_period_start': timezone.now(),
                    'current_period_end': data.get('next_payment_date'),
                }

                if 'plan' in data:
                    try:
                        defaults['subscription_price'] = SubscriptionPrice.objects.get(
                            paystack_id=data['plan']['plan_code']
                        )
                    except SubscriptionPrice.DoesNotExist as e:
                        logger.warning(f"Plan {data['plan']['plan_code']} not found: {str(e)}")

                UserSubscription.objects.update_or_create(
                    subscription_code=data['subscription_code'],
                    defaults={
                        **defaults,
                        'user':user,
                        }
                )

                logger.info(f"Processed subscription {data['subscription_code']}")
                return JsonResponse({'status': 'success'})

        except Exception as e:
            logger.error(f"Webhook processing failed: {str(e)}\n{format_exc()}")
            return JsonResponse(
                {'error': 'Internal server error'},
                status=500
            )

    return JsonResponse({'error': 'Invalid method'}, status=405)