# Generated by Django 3.1.1 on 2020-12-04 15:47

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('orders', '0017_auto_20201202_1436'),
    ]

    operations = [
        migrations.AddField(
            model_name='order',
            name='is_active',
            field=models.BooleanField(default=True),
        ),
    ]
