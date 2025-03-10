from django.shortcuts import render, get_object_or_404, redirect
from django.http import HttpResponse, Http404, JsonResponse
from django.contrib.auth.decorators import login_required
from django.contrib.auth import get_user_model
from allauth.account.models import EmailConfirmationHMAC, EmailAddress
from allauth.account.views import ConfirmEmailView
from allauth.account.utils import send_email_confirmation
from django.core.mail import send_mail
from django.utils.http import urlsafe_base64_encode, urlsafe_base64_decode
from django.utils.encoding import force_bytes
from django.conf import settings
from django.contrib.auth.tokens import default_token_generator
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework import status
from rest_framework.permissions import AllowAny
from base64 import urlsafe_b64encode
from rest_framework.decorators import api_view, permission_classes
from django.utils import timezone
from django.utils.crypto import get_random_string
from profiles.models import Profile

User = get_user_model()  # Get the User model at the top level to avoid repetition


@api_view(['POST'])
@permission_classes([AllowAny])
def request_password_reset(request):
    email = request.data.get('email')
    user = get_object_or_404(User, email=email)

    # Generate a reset token
    reset_token = get_random_string(50)
    user.profile.reset_token = reset_token
    user.profile.reset_token_expires = timezone.now() + timezone.timedelta(hours=1)  # Token valid for 1 hour
    user.profile.save()

    # Send the reset email
    reset_link = f"{settings.FRONTEND_URL}/reset-password/{reset_token}/"
    send_mail(
        'Password Reset Request',
        f'Click the link to reset your password: {reset_link}',
        settings.DEFAULT_FROM_EMAIL,
        [email],
        fail_silently=False,
    )

    return Response({'message': 'Password reset email sent.'}, status=status.HTTP_200_OK)

@api_view(['GET'])
@permission_classes([AllowAny])
def verify_reset_token(request, token):
    profile = get_object_or_404(Profile, reset_token=token)
    if profile.reset_token_expires < timezone.now():
        return Response({'error': 'Token has expired.'}, status=status.HTTP_400_BAD_REQUEST)
    return Response({'message': 'Token is valid.'}, status=status.HTTP_200_OK)

@api_view(['POST'])
@permission_classes([AllowAny])
def reset_password(request, token):
    profile = get_object_or_404(Profile, reset_token=token)
    if profile.reset_token_expires < timezone.now():
        return Response({'error': 'Token has expired.'}, status=status.HTTP_400_BAD_REQUEST)

    new_password = request.data.get('new_password')
    user = profile.user
    user.set_password(new_password)
    profile.reset_token = None
    profile.reset_token_expires = None
    profile.save()
    user.save()

    return Response({'message': 'Password reset successfully.'}, status=status.HTTP_200_OK)

from allauth.account.models import EmailConfirmation, EmailConfirmationHMAC
from django.views.decorators.csrf import csrf_exempt

from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from allauth.account.models import EmailConfirmation, EmailConfirmationHMAC
import json

@csrf_exempt
def confirm_email(request):
    if request.method == 'POST':
        try:
            # Parse JSON data from the request body
            data = json.loads(request.body)
            key = data.get('key')
            if not key:
                return JsonResponse({'status': 'error', 'message': 'Key is required.'}, status=400)
            
            confirmation = EmailConfirmationHMAC.from_key(key)
            if confirmation:
                confirmation.confirm(request)
                return JsonResponse({'status': 'success', 'message': 'Email confirmed.'})
        except json.JSONDecodeError:
            return JsonResponse({'status': 'error', 'message': 'Invalid JSON data.'}, status=400)
        except EmailConfirmation.DoesNotExist:
            return JsonResponse({'status': 'error', 'message': 'Invalid confirmation key.'}, status=400)
    return JsonResponse({'status': 'error', 'message': 'Invalid request method.'}, status=405)


from allauth.socialaccount.adapter import DefaultSocialAccountAdapter

from allauth.socialaccount.adapter import DefaultSocialAccountAdapter
from allauth.exceptions import ImmediateHttpResponse
from django.shortcuts import redirect
from django.contrib import messages
from django.urls import reverse
from django.core.exceptions import ValidationError
from allauth.account.utils import perform_login
from allauth.socialaccount.models import SocialAccount
from django.contrib.auth import get_user_model


class CustomSocialAccountAdapter(DefaultSocialAccountAdapter):
    def pre_social_login(self, request, sociallogin):
    
        email = sociallogin.account.extra_data.get("email")

        # Check if a user with this email already exists
        try:
            user = User.objects.get(email=email)
            # Link the social account to the existing user
            sociallogin.connect(request, user)
            perform_login(request, user, email_verification="optional")
            raise ImmediateHttpResponse(redirect(reverse("dashboard")))  # Redirect to dashboard or home
        except User.DoesNotExist:
            # If the user doesn't exist, proceed with the default flow
            pass

    def save_user(self, request, sociallogin, form=None):
        """
        Saves a newly signed-up user via social login.
        """
        user = super().save_user(request, sociallogin, form)

        # Custom logic to handle user creation
        email = sociallogin.account.extra_data.get("email")
        first_name = sociallogin.account.extra_data.get("given_name", "")
        last_name = sociallogin.account.extra_data.get("family_name", "")

        # Update user details
        user.email = email
        user.first_name = first_name
        user.last_name = last_name
        user.save()

        return user

    def is_auto_signup_allowed(self, request, sociallogin):
        """
        Determines whether automatic signup is allowed.
        """
        # Allow auto signup for new users
        return True

    def validate_disconnect(self, account, accounts):
        """
        Validates whether the social account can be disconnected.
        """
        # Prevent users from disconnecting their last social account
        if accounts.count() == 1:
            raise ValidationError("You cannot disconnect your last social account.")


# class CustomConfirmEmailView(ConfirmEmailView):
#     def get(self, *args, **kwargs):
#         # Get the key from URL parameters
#         key = kwargs.get("key")

#         try:
#             confirmation = EmailConfirmationHMAC.from_key(key)
#             if confirmation:
#                 confirmation.confirm(self.request)
#                 return redirect(f"{settings.FRONTEND_URL}/confirm-email/{key}/")
#             else:
#                 raise Http404
#         except Http404:
#             return redirect(f"{settings.FRONTEND_URL}/confirm-email/error")

# confirm_email = CustomConfirmEmailView.as_view()

def resend_confirmation_email(request):
    email = request.GET.get('email')

    if not email:
        return JsonResponse({"error": "Email is required"}, status=400)
    
    try:
        profile = User.objects.get(email=email)
        email_address = EmailAddress.objects.get_for_user(profile, email)

        if email_address.verified:
            return JsonResponse({"error": "Email is already verified."}, status=400)
        
        send_email_confirmation(request, profile, email=email)
        return JsonResponse({"message": "Confirmation email sent successfully"}, status=200)
    except User.DoesNotExist:
        return JsonResponse({"error": "User with this email does not exist. Please register your account"}, status=404)
    except EmailAddress.DoesNotExist:
        return JsonResponse({"error": "Email address not found."}, status=404)


from allauth.account.adapter import DefaultAccountAdapter

class CustomAccountAdapter(DefaultAccountAdapter):
    def get_email_confirmation_url(self, request, emailconfirmation):
        # Construct the frontend URL for email confirmation
        frontend_url = "http://localhost:8080/confirm-email/"  # Your frontend URL
        key = emailconfirmation.key
        return f"{frontend_url}{key}/"

class PasswordResetRequestView(APIView):
    permission_classes = [AllowAny]
    
    def post(self, request):
        email = request.data.get("email")
        if not email:
            return Response({"error": "Email is required."}, status=status.HTTP_400_BAD_REQUEST)
            
        try:
            profile = User.objects.get(email=email)
        except User.DoesNotExist:
            return Response({"message": "If your email is registered, you will receive a password reset link."}, 
                           status=status.HTTP_200_OK)

        
        uidb64 = urlsafe_base64_encode(force_bytes(profile.pk))
        
        print(f"Generated uidb64 (Base64-encoded): {uidb64}")  # Debugging

        token = default_token_generator.make_token(profile)

        reset_link = f"http://localhost:8080/reset-password-confirm/{uidb64}/{token}/"
        print(f"Reset Link: {reset_link}")  # Debugging

        # Send email
        send_mail(
            "Password Reset Request",
            f"Click the link below to reset your password:\n{reset_link}",
            settings.DEFAULT_FROM_EMAIL,
            [profile.email],
        )

        return Response({"message": "If your email is registered, you will receive a password reset link."}, 
                       status=status.HTTP_200_OK)

class PasswordResetConfirmView(APIView):
    permission_classes = [AllowAny]
    
    def decode_uid(self, uidb64):
        """Ensure correct padding before decoding."""
        uidb64 += "=" * (-len(uidb64) % 4)  # Add missing padding if needed
        return urlsafe_base64_decode(uidb64).decode()
    
    def get(self, request, uidb64, token):
        print(f"Received uidb64: {uidb64}, token: {token}")

        try:
            #padding = '=' * (4 - len(uidb64) % 4)
            decoded_uid = self.decode_uid(uidb64)
            print(f"Decoded UID: {decoded_uid}")  # Should match a valid profile ID
            profile = User.objects.get(pk=int(decoded_uid))  # Convert to int
        except Exception as e:
            print(f"Decoding error: {e}")
            return Response({"error": "Invalid reset link."}, status=status.HTTP_400_BAD_REQUEST)

        if not default_token_generator.check_token(profile, token):
            return Response({"error": "Reset link is invalid or has expired."}, status=status.HTTP_400_BAD_REQUEST)

        return Response({"valid": True, "message": "Token is valid."}, status=status.HTTP_200_OK)
    
    def post(self, request, uidb64, token):
        try:
            padding = '=' * (4 - len(uidb64) % 4)
            decoded_uid = urlsafe_base64_decode(uidb64+padding).decode()
            profile = User.objects.get(pk=int(decoded_uid))
        except Exception as e:
            print(f"Decoding error: {e}")
            return Response({"error": "Invalid reset link."}, status=status.HTTP_400_BAD_REQUEST)

        if not default_token_generator.check_token(profile, token):
            return Response({"error": "Reset link is invalid or has expired."}, status=status.HTTP_400_BAD_REQUEST)

        # Get new password from request
        new_password = request.data.get("new_password")
        confirm_password = request.data.get("confirm_password")

        if not new_password or not confirm_password:
            return Response({"error": "Both password fields are required."}, status=status.HTTP_400_BAD_REQUEST)

        if new_password != confirm_password:
            return Response({"error": "Passwords do not match."}, status=status.HTTP_400_BAD_REQUEST)

        # Set new password
        profile.set_password(new_password)
        profile.save()

        return Response({"message": "Password reset successful."}, status=status.HTTP_200_OK)


@login_required
def profile_list_view(request):
    context = {
        "object_list": User.objects.filter(is_active=True)
    }
    return render(request, "profiles/list.html", context)

@login_required
def profile_detail_view(request, username=None, *args, **kwargs):
    profile = request.profile
    print(profile.has_perm("subscriptions.basic"),
          profile.has_perm("subscriptions.pro"),
          profile.has_perm("subscriptions.advanced"))
          
    profile_usr_obj = get_object_or_404(User, username=username)
    is_me = profile_usr_obj == profile
    context = {
        "object": profile_usr_obj,
        "instance": profile_usr_obj,
        "owner": is_me
    }
    return render(request, "profiles/detail.html", context)