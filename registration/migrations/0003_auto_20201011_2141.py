# Generated by Django 3.1.1 on 2020-10-11 21:41

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('registration', '0002_remove_client_email'),
    ]

    operations = [
        migrations.AlterField(
            model_name='client',
            name='address',
            field=models.ManyToManyField(blank=True, to='registration.Address'),
        ),
    ]