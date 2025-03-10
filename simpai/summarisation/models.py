from django.db import models
from django.conf import settings


class UploadedFile(models.Model):
    file = models.FileField(upload_to="uploads/")
    user=models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, null=True, blank=True)
    uploaded_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.file.name