from django.core.management.base import BaseCommand
from django.contrib.auth.models import User
from profiles.models import Profile

class Command(BaseCommand):
    help = 'Create Profile objects for all existing users'

    def handle(self, *args, **kwargs):
        users = User.objects.all()
        for user in users:
            if not hasattr(user, 'profile'):
                Profile.objects.create(user=user)
                self.stdout.write(self.style.SUCCESS(f'Created Profile for user: {user.email}'))
        self.stdout.write(self.style.SUCCESS('All profiles created successfully'))