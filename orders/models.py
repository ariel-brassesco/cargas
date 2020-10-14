from django.db import models

from registration.models import Client, Inspector

# Create your models here.
class Order(models.Model):
    client = models.ForeignKey(Client, on_delete=models.CASCADE)
    inspector = models.ForeignKey(Inspector, on_delete=models.CASCADE)
    date_start = models.DateTimeField()
    date_complete = models.DateTimeField()
    origen = models.CharField(max_length=100)
    discharge = models.CharField(max_length=100)
    shipping_line = models.CharField(max_length=100, blank=True, null=True)
    vessel_name = models.CharField(max_length=100)
    etd = models.CharField(max_length=100, blank=True, null=True)
    eta = models.CharField(max_length=100, blank=True, null=True)
    seal = models.CharField(max_length=50)
    container = models.CharField(max_length=20)
    plant = models.CharField(max_length=50)
    boxes = models.IntegerField(default=0)
    net_weight = models.FloatField(default=0)
    gross_weight = models.FloatField(default=0)
    lot = models.IntegerField(default=0)

class RowOrder(models.Model):
    order = models.ForeignKey(Order, on_delete=models.CASCADE, related_name='rows')
    number = models.IntegerField(default=1)
    product = models.CharField(max_length=100)
    size = models.CharField(max_length=100)
    quantity = models.IntegerField(default=0)

class WeightControl(models.Model):
    order = models.ForeignKey(Order, on_delete=models.CASCADE, related_name='weights')
    package = models.FloatField()
    carton = models.FloatField()
    product = models.FloatField()

class TemperatureControl(models.Model):
    order = models.ForeignKey(Order, on_delete=models.CASCADE, related_name='temps')
    row = models.ForeignKey(RowOrder, on_delete=models.CASCADE)
    temp = models.FloatField()

# class OrganolepticControl(modelss.Model):
#     order = models.ForeignKey(Order, on_delete=models.CASCADE, related_name='measures')

