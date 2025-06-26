from django.db import models
import helpers.billing
from django.conf import settings
from allauth.account.signals import(
    user_signed_up as allauth_user_signed_up,
    email_confirmed as allauth_email_confirmed
)


User=settings.AUTH_USER_MODEL

# class CustomeUser(AbstractUser):
#     email = models.EmailField(unique=True)  # Enforce unique emails at the database level

#     def __str__(self):
#         return self.email
    
class Customer(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE)
    paystack_id = models.CharField(max_length=120, null=True, blank=True)
    init_email = models.EmailField(blank=True, null=True)
    init_email_confirmed = models.BooleanField(default=False)
    first_name = models.CharField(max_length=120, blank=True, null=True)
    last_name = models.CharField(max_length=120, blank=True, null=True)

    def __str__(self):
        return f"{self.user.email}"
    
    def save(self, *args, **kwargs):
        if not self.paystack_id:
            if self.init_email_confirmed and self.init_email:
                email = self.init_email
                if email != '' or email is not None:
                    paystack_id = helpers.billing.create_customer(email=email, metadata={"user_id": self.user_id}, raw=False)
                    self.paystack_id = paystack_id
        super().save(*args, **kwargs)

def allauth_user_signed_up_handler(request, user, *args, **kwargs):
    email = user.email
    # user.first_name = request.POST.get("first_name", "")
    # user.save()
    Customer.objects.create(user=user, init_email=email, init_email_confirmed=False)

allauth_user_signed_up.connect(allauth_user_signed_up_handler)

def allauth_email_confirmed_handler(request, email_address, *args, **kwargs):
    qs=Customer.objects.filter(init_email=email_address, init_email_confirmed=False)
    for obj in qs:
        obj.init_email_confirmed=True
        obj.save()

allauth_email_confirmed.connect(allauth_email_confirmed_handler)
