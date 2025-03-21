from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from rest_framework.authentication import TokenAuthentication
from django.contrib.auth.models import User
from customers.models import Customer
from subscriptions.models import UserSubscription  # Import the UserSubscription model
from django.utils import timezone

class UserProfileView(APIView):
    authentication_classes = [TokenAuthentication]  # Use token-based authentication
    permission_classes = [IsAuthenticated]  # Only allow authenticated users

    def get(self, request):
        user = request.user
        customer = Customer.objects.filter(user=user).first()  # Avoid DoesNotExist error

        data = {
            "first_name": customer.first_name if customer else user.first_name,
            "email": user.email,
            "plan": "None",  # Default to "Free"
            "status": "inactive",  # Default to "inactive"
            "current_period_end": None,  # Default to None
        }

        # Fetch the user's subscription
        user_subscription = UserSubscription.objects.filter(user=user).first()
        if user_subscription:
            # Update plan, status, and current_period_end if subscription exists
            if user_subscription.subscription_price:
                data["plan"] = user_subscription.subscription_price.name
            data["status"] = user_subscription.status
            if user_subscription.current_period_end:
                data["current_period_end"] = user_subscription.current_period_end.strftime("%Y-%m-%d")

        return Response(data)