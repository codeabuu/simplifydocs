# Generated by Django 5.1.4 on 2025-06-20 21:31

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('subscriptions', '0008_subscriptionprice_active'),
    ]

    operations = [
        migrations.RenameField(
            model_name='subscriptionprice',
            old_name='paystack_id',
            new_name='paystack_i',
        ),
    ]
