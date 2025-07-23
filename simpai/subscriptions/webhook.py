# webhooks.py or views.py
from django.views.decorators.csrf import csrf_exempt
from django.http import JsonResponse
from django.conf import settings
import json
from subscriptions.models import UserSubscription
from django.utils import timezone

@csrf_exempt
def paystack_webhook(request):
    if request.method == 'POST':
        payload = json.loads(request.body)
        event = payload.get('event')
        
        # Verify it's a real Paystack webhook (optional but recommended)
        if payload.get('data', {}).get('domain') != 'test' and not settings.DEBUG:
            # Add HMAC verification here for production
            pass

        # Handle subscription events
        if event == 'subscription.create':
            subscription_code = payload['data']['subscription_code']
            customer_code = payload['data']['customer']['customer_code']
            email = payload['data']['customer']['email']
            
            # Save to database
            UserSubscription.objects.update_or_create(
                subscription_code=subscription_code,
                defaults={
                    'customer_code': customer_code,
                    'user_email': email,
                    'status': 'active',
                    'paid_at': timezone.now()
                }
            )
            return JsonResponse({'status': 'success'})

        elif event == 'charge.success':
            # Handle payment success (if needed)
            subscription_code = payload['data'].get('subscription', {}).get('subscription_code')
            if subscription_code:
                UserSubscription.objects.filter(
                    subscription_code=subscription_code
                ).update(
                    status='success',
                    paid_at=timezone.now()
                )
            
        return JsonResponse({'status': 'event processed'})
    
    return JsonResponse({'status': 'invalid method'}, status=405)