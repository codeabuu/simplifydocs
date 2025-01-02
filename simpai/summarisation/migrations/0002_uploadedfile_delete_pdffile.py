# Generated by Django 5.1.4 on 2025-01-01 21:52

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('summarisation', '0001_initial'),
    ]

    operations = [
        migrations.CreateModel(
            name='UploadedFile',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('file', models.FileField(upload_to='uploads/')),
                ('uploaded_at', models.DateTimeField(auto_now_add=True)),
            ],
        ),
        migrations.DeleteModel(
            name='PDFFile',
        ),
    ]
