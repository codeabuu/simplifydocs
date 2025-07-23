import requests 
from decouple import config
import stripe.error
from . import date_utils
from subscriptions.models import UserSubscription

class PaystackService:
    BASE_URL = "https://api.paystack.co"


    @staticmethod
    def _get_headers():
        secret_key = config('PAYSTACK_SECRET_KEY').strip()
        if not secret_key.startswith('Bearer '):
            secret_key = f'Bearer {secret_key}'
        return {
            "Authorization": secret_key,
            "Content-Type": "application/json"
        }

# def serialize_subscription_data(subscription_response):
#     status = subscription_response.status
#     current_period_start = date_utils.timestamp_as_datetime(subscription_response.current_period_start)
#     current_period_end = date_utils.timestamp_as_datetime(subscription_response.current_period_end)
#     canceled_at_period_end = subscription_response.cancel_at_period_end

#     return {
#         "current_period_start": current_period_start,
#         "current_period_end": current_period_end,
#         "status": status,
#         "cancel_at_period_end": canceled_at_period_end,
#     }

    @staticmethod
    def create_customer(email="", metadata={}, raw=False):
        url = f"{PaystackService.BASE_URL}/customer"
        payload = {
            "email": email,
            "metadata": metadata,
        }
        response = requests.post(
            url,
            headers=PaystackService._get_headers(),
            json=payload
            )
        if raw:
            return response
        return response.json().get("data", {}).get("customer_code", None)

    def create_plan(name="", amount=None, interval="monthly", metadata={}, raw=False):
        url = f"{PaystackService.BASE_URL}/plan"
        payload = {
            "name": name,
            "amount": int(float(amount)) if amount is not None else None,  # Paystack expects amount in kobo
            "interval": interval,
            "currency": "NGN",  # Default to USD, change as needed
            # "metadata": metadata,
        }
        response = requests.post(
            url,
            headers=PaystackService._get_headers(),
            json=payload
        )
        if raw:
            return response.json()
        return response.json().get("data", {}).get("plan_code", None)

    # In billing.py
    @staticmethod
    def handle_subscription_event(payload):
        """Centralized subscription processing"""
        data = payload.get('data', {})
        subscription_code = data.get('subscription_code')
        
        # Always verify with Paystack first
        sub_data = PaystackService.get_subscription(subscription_code)
        if not sub_data or sub_data.get('status') not in ['active', 'trialing']:
            return False

        # Update or create record
        UserSubscription.objects.update_or_create(
            subscription_code=subscription_code,
            defaults={
                'customer_code': sub_data['customer_code'],
                'status': sub_data['status'],
                'current_period_start': sub_data['current_period_start'],
                'current_period_end': sub_data['current_period_end'],
                'plan_code': sub_data['plan_code']
            }
        )
        return True

    @staticmethod
    def initialize_subscription(email, plan_code, amount,  success_url, metadata=None):
        url = f"{PaystackService.BASE_URL}/transaction/initialize"
        payload = {
            "email": email,
            "plan": plan_code,
            "amount": int(amount),  # Amount is determined by the pla
            "callback_url": success_url,
            "metadata": metadata or {}
        }
        response = requests.post(
            url,
            headers=PaystackService._get_headers(),
            json=payload
        )
        if response.status_code != 200 or 'data' not in response.json():
            print("Paystack ERROR RESPONSE:", response.status_code, response.text)
            return None
        return response.json()['data']['authorization_url']


    @staticmethod
    def verify_transaction(reference, user=None):
        """Verify transaction and save to DB if successful"""
        url = f"{PaystackService.BASE_URL}/transaction/verify/{reference}"
        
        try:
            response = requests.get(url, headers=PaystackService._get_headers(), timeout=10)
            response.raise_for_status()
            data = response.json()

            if not data.get("status"):
                return {
                    "is_successful": False,
                    "message": data.get("message", "Verification failed"),
                    "status": "failed"
                }

            tx = data["data"]
            is_successful = (
                tx.get("status") == "success" and tx.get("gateway_response") == "Successful"
            )

            if is_successful:
                from subscriptions.models import PaystackTransaction
                from django.utils.dateparse import parse_datetime

                PaystackTransaction.objects.get_or_create(
                    reference=tx["reference"],
                    defaults={
                        "user": user,
                        "amount": int(tx["amount"]) / 100,
                        "status": tx["status"],
                        "gateway_response": tx["gateway_response"],
                        "paid_at": parse_datetime(tx["paid_at"]),
                        "plan_code": tx.get("plan"),
                        "customer_code": tx.get("customer", {}).get("customer_code"),
                        "raw_data": tx,
                    }
                )

            return {
                "is_successful": is_successful,
                "status": "success" if is_successful else "failed",
                "customer_code": tx.get("customer", {}).get("customer_code"),
                "plan_code": tx.get("plan"),
                "paid_at": tx.get("paid_at"),
                "amount": tx.get("amount"),
                "message": tx.get("message")
            }

        except requests.exceptions.RequestException as e:
            return {
                "is_successful": False,
                "status": "error",
                "message": f"API request failed: {str(e)}"
            }

    
    @staticmethod
    def get_customer_transactions(customer_email):
        """Fetch all transactions for a customer from Paystack"""
        url = f"{PaystackService.BASE_URL}/transaction?customer={customer_email}"
        response = requests.get(url, headers=PaystackService._get_headers())
        return response.json().get('data', [])

    @staticmethod
    def extract_subscription_from_transaction(reference, raw=False):
        """
        After verifying a transaction, extract subscription info.
        """
        result = PaystackService.verify_transaction(reference)
        data = result.get("data", {})

        subscription = data.get("subscription", {})
        if raw:
            return data  # Return full data for debugging

        return {
            "subscription_code": subscription.get("subscription_code"),
            "customer_code": data.get("customer", {}).get("customer_code"),
            "status": data.get("status"),
            "plan_code": data.get("plan"),
            "paid_at": data.get("paid_at"),
        }

    @staticmethod
    def get_subscription(subscription_code, raw=False):
        url = f"{PaystackService.BASE_URL}/subscription/{subscription_code}"
        response = requests.get(url, headers=PaystackService._get_headers())
        response_data = response.json()
        
        # Add error handling
        if not response_data.get('status'):
            print(f"Paystack Error: {response_data.get('message')}")
            return None
            
        if 'data' not in response_data:
            print("Unexpected Paystack response:", response_data)
            return None
            
        data = response_data['data']
        
        if raw:
            return data
            
        return {
            "status": data.get("status"),
            "current_period_start": data.get("createdAt"),  # Paystack uses createdAt
            "current_period_end": data.get("next_payment_date"),
            "plan_code": data.get("plan", {}).get("plan_code"),
            "customer_code": data.get("customer", {}).get("customer_code"),
        }
    
    @staticmethod
    def cancel_subscription(subscription_code, raw=False):
        url = f"{PaystackService.BASE_URL}/subscription/disable"
        payload = {
            "code": subscription_code,
            "token": config("PAYSTACK_SECRET_KEY"),
        }
        response = requests.post(url, headers=PaystackService._get_headers())
        if raw:
            return response.json()
        return response.json()

    @staticmethod
    def get_customer_by_email(email, raw=False):
        """
        Fetch customer details using email address
        Returns: customer_code if found, None otherwise
        """
        url = f"{PaystackService.BASE_URL}/customer/{email}"
        response = requests.get(url, headers=PaystackService._get_headers())
        data = response.json().get('data', {})
        
        if raw:
            return data
        
        return data.get('customer_code')  # Return just the customer code


    @staticmethod
    def get_customer_subscriptions(customer_code, raw=False):
        url = f"{PaystackService.BASE_URL}/subscription"
        params = {
        "customer": customer_code,
        "status": "ACTIVE",
        "perPage": 5  # Ensure we get all subscriptions
    }
        try:
            print(f"DEBUG: Requesting {url} with params: {params}")
            response = requests.get(
                url,
                headers=PaystackService._get_headers(),
                params=params,  # More reliable than URL concatenation
                timeout=15  # Prevents hanging
            )
            print(f"DEBUG: Raw API response: {response.text}")

            response.raise_for_status()  # Raises HTTPError for 4XX/5XX
            
            data = response.json()
            if not data.get("status", False):  # Paystack returns {"status": false} on errors
                raise Exception(f"Paystack error: {data.get('message', 'Unknown error')}")
            
            return data if raw else data.get("data", ["subscription"])
        
        except requests.exceptions.RequestException as e:
            print(f"API request failed: {e}")
            return [] if not raw else {"status": False, "message": str(e)}
    
create_customer = PaystackService.create_customer
create_plan = PaystackService.create_plan
start_checkout_session = PaystackService.initialize_subscription
get_subscription = PaystackService.get_subscription
cancel_subscription = PaystackService.cancel_subscription
get_customer_active_subscription = PaystackService.get_customer_subscriptions
verify_transaction = PaystackService.verify_transaction
get_customer_by_email = PaystackService.get_customer_by_email
get_customer_transaction = PaystackService.get_customer_transactions