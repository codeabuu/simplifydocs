# serializers.py
from rest_framework import serializers
from .models import UploadedSpreadsheet

class UploadedSpreadsheetSerializer(serializers.ModelSerializer):
    class Meta:
        model = UploadedSpreadsheet
        fields = ['id', 'file', 'uploaded_at']