from django.db import models
from django.contrib.auth.models import User

class Profile(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE)
    reset_token = models.CharField(max_length=50, blank=True, null=True)
    reset_token_expires = models.DateTimeField(blank=True, null=True)

    def __str__(self):
        return self.user.email
    

from django.contrib.auth import get_user_model
from django.utils.crypto import get_random_string
from django.utils import timezone

User = get_user_model()

class EmailConfirmation(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='email_confirmation')
    token = models.CharField(max_length=64, unique=True)
    created_at = models.DateTimeField(auto_now_add=True)
    confirmed = models.BooleanField(default=False)

    def generate_token(self):
        self.token = get_random_string(64)
        self.save()

    def is_expired(self):
        # Token expires after 24 hours
        return (timezone.now() - self.created_at).total_seconds() > 86400
