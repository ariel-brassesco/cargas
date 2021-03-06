# Generated by Django 3.1.1 on 2020-10-25 12:16

from django.db import migrations, models
import django.db.models.deletion
import django.utils.timezone


class Migration(migrations.Migration):

    dependencies = [
        ('orders', '0005_auto_20201017_1202'),
    ]

    operations = [
        migrations.CreateModel(
            name='Product',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('name', models.CharField(max_length=100)),
            ],
        ),
        migrations.RenameField(
            model_name='order',
            old_name='date_start',
            new_name='date',
        ),
        migrations.RemoveField(
            model_name='order',
            name='date_complete',
        ),
        migrations.AddField(
            model_name='order',
            name='booking',
            field=models.CharField(default=1, max_length=100),
            preserve_default=False,
        ),
        migrations.AddField(
            model_name='order',
            name='comment',
            field=models.TextField(blank=True),
        ),
        migrations.AddField(
            model_name='order',
            name='time_complete',
            field=models.TimeField(default=django.utils.timezone.now),
            preserve_default=False,
        ),
        migrations.AddField(
            model_name='order',
            name='time_start',
            field=models.TimeField(default=django.utils.timezone.now),
            preserve_default=False,
        ),
        migrations.AddField(
            model_name='weightcontrol',
            name='primary_package',
            field=models.FloatField(default=1),
            preserve_default=False,
        ),
        migrations.AlterField(
            model_name='order',
            name='container',
            field=models.CharField(blank=True, max_length=20, null=True),
        ),
        migrations.AlterField(
            model_name='order',
            name='seal',
            field=models.CharField(blank=True, max_length=50, null=True),
        ),
        migrations.AlterField(
            model_name='order',
            name='status',
            field=models.CharField(choices=[('pending', 'pending'), ('initiating', 'initiating'), ('loading', 'loading'), ('cancel', 'cancel'), ('ready', 'ready')], max_length=20),
        ),
        migrations.AddField(
            model_name='order',
            name='products',
            field=models.ManyToManyField(to='orders.Product'),
        ),
        migrations.AlterField(
            model_name='roworder',
            name='product',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='orders.product'),
        ),
    ]
