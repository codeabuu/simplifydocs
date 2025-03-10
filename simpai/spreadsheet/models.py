from django.db import models
from django.conf import settings

class UploadedSpreadsheet(models.Model):
    file = models.FileField(upload_to='spreadsheets/')
    uploaded_at = models.DateTimeField(auto_now_add=True)
    user=models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, null=True, blank=True)
    def __str__(self):
        return self.file.name
