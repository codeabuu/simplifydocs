# Generated by Django 5.1.4 on 2025-06-23 16:00

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('subscriptions', '0011_rename_paystack_id_subscriptionprice_stripe_id'),
    ]

    operations = [
        migrations.RenameField(
            model_name='subscriptionprice',
            old_name='stripe_id',
            new_name='paystack_id',
        ),
    ]
