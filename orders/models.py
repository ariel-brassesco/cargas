from django.db import models
from django.contrib.postgres.fields import ArrayField
from django.utils import timezone

from registration.models import Client, Inspector

# Create your models here.
class Product(models.Model):
    name = models.CharField(max_length=100)

    def __str__(self):
        return self.name

class Order(models.Model):

    STATUS_OPTIONS = [
        ("pending", "pending"),
        ("initiating", "initiating"),
        ("loading", "loading"),
        ("cancel", "cancel"),
        ("ready", "ready")
    ]

    client = models.ForeignKey(Client, on_delete=models.CASCADE)
    inspector = models.ForeignKey(Inspector, on_delete=models.CASCADE)
    products = models.ManyToManyField(Product)
    date = models.DateTimeField(default=timezone.now)
    time_start = models.TimeField()
    time_complete = models.TimeField()
    origin = models.CharField(max_length=100)
    discharge = models.CharField(max_length=100)
    booking = models.CharField(max_length=100)
    vessel_name = models.CharField(max_length=100)
    shipping_line = models.CharField(max_length=100, blank=True, null=True)
    etd = models.CharField(max_length=100, blank=True, null=True)
    eta = models.CharField(max_length=100, blank=True, null=True)
    seal = models.CharField(max_length=50, blank=True, null=True)
    container = models.CharField(max_length=20, blank=True, null=True)
    plant = models.CharField(max_length=50)
    boxes = models.IntegerField(default=0)
    net_weight = models.FloatField(default=0)
    gross_weight = models.FloatField(default=0)
    lot = ArrayField(models.IntegerField(), default=list())
    status = models.CharField(choices=STATUS_OPTIONS, max_length=20)
    comment = models.TextField(default="", blank=True)

    def __str__(self):
        return f"#{self.id}-" \
                f"{self.client.company}-" \
                f"{self.inspector.user.get_full_name()}"

class RowOrder(models.Model):
    order = models.ForeignKey(Order, on_delete=models.CASCADE, related_name='rows')
    number = models.IntegerField(default=1)
    product = models.ForeignKey(Product, on_delete=models.CASCADE)
    size = models.CharField(max_length=100, null=True, blank=True)
    quantity = models.IntegerField(default=0)

class WeightControl(models.Model):
    order = models.ForeignKey(
        Order, 
        on_delete=models.CASCADE,
        related_name='weights'
        )
    package = models.FloatField()
    carton = models.FloatField()
    primary_package = models.FloatField(default=0)
    product = models.FloatField()

class TemperatureControl(models.Model):
    order = models.ForeignKey(
        Order,
        on_delete=models.CASCADE,
        related_name='temps')
    row = models.ForeignKey(RowOrder, on_delete=models.CASCADE)
    temp = models.FloatField()
