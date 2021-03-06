# Generated by Django 3.1.1 on 2020-11-15 19:59

from django.db import migrations, models
import django.db.models.deletion
import orders.models


class Migration(migrations.Migration):

    dependencies = [
        ('orders', '0013_auto_20201115_1418'),
    ]

    operations = [
        migrations.AlterField(
            model_name='order',
            name='status',
            field=models.CharField(choices=[('pending', 'pending'), ('initiating', 'initiating'), ('loading', 'loading'), ('closing', 'closing'), ('finish', 'finish'), ('cancel', 'cancel'), ('ready', 'ready')], max_length=20),
        ),
        migrations.CreateModel(
            name='CloseOrder',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('full', models.ImageField(upload_to=orders.models.name_files_container)),
                ('semi_close', models.ImageField(blank=True, null=True, upload_to=orders.models.name_files_container)),
                ('close', models.ImageField(blank=True, null=True, upload_to=orders.models.name_files_container)),
                ('precinto', models.ImageField(blank=True, null=True, upload_to=orders.models.name_files_container)),
                ('uploaded_at', models.DateTimeField(auto_now=True)),
                ('order', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='final', to='orders.order')),
            ],
        ),
    ]
