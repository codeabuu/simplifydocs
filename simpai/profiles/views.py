from django.shortcuts import render, get_object_or_404
from django.http import HttpResponse
from django.contrib.auth.decorators import login_required
from django.contrib.auth import get_user_model

from django.shortcuts import redirect
from allauth.account.models import EmailConfirmationHMAC
from allauth.account.views import ConfirmEmailView
from django.http import Http404
from allauth.account import app_settings


from allauth.account.views import ConfirmEmailView
from django.http import JsonResponse, Http404
from allauth.account.models import EmailConfirmationHMAC
from allauth.account.utils import send_email_confirmation
from allauth.account.models import EmailAddress
from django.core.mail import send_mail
from allauth.account.forms import ResetPasswordForm

from allauth.account.forms import ResetPasswordKeyForm



class CustomConfirmEmailView(ConfirmEmailView):
    def get(self, *args, **kwargs):
        # Get the key from URL parameters
        key = kwargs.get("key")

        try:
            confirmation = EmailConfirmationHMAC.from_key(key)
            if confirmation:
                confirmation.confirm(self.request)
                return redirect(f"http://localhost:8080/confirm-email/{key}/")
            else:
                raise Http404
        except Http404:
            return redirect(f"http:localhost:8080/confirm-email/error")

confirm_email = CustomConfirmEmailView.as_view()


def resend_confirmation_email(request):
    email = request.GET.get('email')

    if not email:
        return JsonResponse({"error": "Email is required"}, status=400)
    
    User = get_user_model()
    try:
        user = User.objects.get(email=email)
        email_address = EmailAddress.objects.get_for_user(user, email)

        if email_address.verified:
            return JsonResponse({"error": "Email is already verified."}, status=400)
        
        send_email_confirmation(request, user, email=email)
        return JsonResponse({"message": "Confirmation email sent succesfully"}, status=200)
    except User.DoesNotExist:
        return JsonResponse({"error": "User with this email does not exist. Please register your account"}, status=404)
    except EmailAddress.DoesNotExist:
        return JsonResponse({"error": "Email address not found."}, status=404)

confirm_email = CustomConfirmEmailView.as_view()


def request_password_reset(request):
    email = request.GET.get('email')

    if not email:
        return JsonResponse({"error": "Email is required."}, status=400)

    User = get_user_model()
    try:
        user = User.objects.get(email=email)
    except User.DoesNotExist:
        return JsonResponse({"error": "User with this email does not exist. Please register your account."}, status=404)

    # Use Allauth's ResetPasswordForm to send the reset email
    form = ResetPasswordForm(data={"email": email})
    if form.is_valid():
        form.save(request=request)
        return JsonResponse({"message": "Password reset email sent successfully."}, status=200)
    else:
        return JsonResponse({"error": "Invalid email address."}, status=400)

# def confirm_password_reset(request):
#     uid = request.GET.get('uid')
#     token = request.GET.get('token')
#     new_password1 = request.GET.get('new_password1')
#     new_password2 = request.GET.get('new_password2')

#     if not uid or not token or not new_password1 or not new_password2:
#         return JsonResponse({"error": "All fields are required."}, status=400)

#     User = get_user_model()
#     try:
#         user = User.objects.get(pk=uid)
#     except User.DoesNotExist:
#         return JsonResponse({"error": "Invalid user."}, status=404)

#     # Use Allauth's ResetPasswordKeyForm to validate and reset the password
#     form = ResetPasswordKeyForm(data={
#         "uid": uid,
#         "token": token,
#         "new_password1": new_password1,
#         "new_password2": new_password2,
#     })

#     if form.is_valid():
#         form.save()
#         return JsonResponse({"message": "Password reset successfully."}, status=200)
#     else:
#         return JsonResponse({"error": "Invalid token or passwords do not match."}, status=400)

User=get_user_model()

@login_required
def profile_list_view(request):
    context = {
        "object_list": User.objects.filter(is_active=True)
}
    return render(request, "profiles/list.html", context)


@login_required
def profile_detail_view(request, username=None, *args, **kwargs):
    user = request.user
    print(user.has_perm("subscriptions.basic"),
          user.has_perm("subscriptions.pro"),
          user.has_perm("subscriptions.advanced"),
          )
    # user_groups = user.groups.all()
    # print("user groups", user_groups)

    # if user_groups.filter(name__icontains='basic').exists():
    #     return HttpResponse("Congrats")
    profile_usr_obj = get_object_or_404(User, username=username)
    is_me = profile_usr_obj == user
    context = {
        "object": profile_usr_obj,
        "instance": profile_usr_obj,
        "owner": is_me
    }
    return render(request, "profiles/detail.html", context)