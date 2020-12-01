from django.db import models
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
        ("closing", "closing"),
        ("finish", "finish"),
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
    lot = models.CharField(max_length=50, default="", blank=True)
    status = models.CharField(choices=STATUS_OPTIONS, max_length=20)
    comment = models.TextField(default="", blank=True)

    def __str__(self):
        return f"#{self.id}-" \
            f"{self.client.company}-" \
            f"{self.inspector.user.get_full_name()}"


def name_files_row(instance, filename):
    return f"carga_{instance.order.id}/row_{instance.number}/{filename}"


class RowOrder(models.Model):
    order = models.ForeignKey(
        Order, on_delete=models.CASCADE, related_name='rows')
    number = models.IntegerField(default=1)
    product = models.ForeignKey(Product, on_delete=models.CASCADE)
    size = models.CharField(max_length=100, null=True, blank=True)
    image = models.ImageField(upload_to=name_files_row)
    quantity = models.IntegerField(default=0)
    display = models.BooleanField(default=False)

    def get_file_extension(self, name):
        # Get the file extension
        return f".{name.split('.')[-1]}"

    def save(self, *args, **kwargs):
        '''
            Change the name of images.
        '''
        # Change the name of image
        image_name = f"{self.order.id}-row_{self.number}"
        if image_name not in self.image.name:
            self.image.name = image_name + \
                f"{self.get_file_extension(self.image.name)}"
        super(RowOrder, self).save(*args, **kwargs)


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
    row = models.PositiveIntegerField(default=1)
    temp = models.FloatField()


def name_files_container(instance, filename):
    return f"carga_{instance.order.id}/contenedor/{filename}"


class ContainerOrder(models.Model):
    """
    This model has the picture for the initial process of load.
    """

    order = models.ForeignKey(
        Order, on_delete=models.CASCADE, related_name='initial')
    empty = models.ImageField(upload_to=name_files_container)
    matricula = models.ImageField(upload_to=name_files_container)
    ventilation = models.ImageField(
        upload_to=name_files_container, null=True, blank=True)
    uploaded_at = models.DateTimeField(auto_now=True)

    def get_file_extension(self, name):
        # Get the file extension
        return f".{name.split('.')[-1]}"

    def save(self, *args, **kwargs):
        '''
            Change the name of images.
        '''

        # Change the name of image
        empty_name = f"{self.order.id}-contenedor-vacio"
        if empty_name not in self.empty.name:
            self.empty.name = empty_name + \
                f"{self.get_file_extension(self.empty.name)}"

        matricula_name = f"{self.order.id}-contenedor-matricula"
        if matricula_name not in self.matricula.name:
            self.matricula.name = matricula_name + \
                f"{self.get_file_extension(self.matricula.name)}"

        if self.ventilation:
            ventilation_name = f"{self.order.id}-ventilacion"
            if ventilation_name not in self.ventilation.name:
                self.ventilation.name = ventilation_name + \
                    f"{self.get_file_extension(self.ventilation.name)}"
        super(ContainerOrder, self).save(*args, **kwargs)


def name_files_closing(instance, filename):
    return f"carga_{instance.order.id}/closing/{filename}"


class CloseOrder(models.Model):
    """
    This model has the picture for the final process of load.
    """

    order = models.ForeignKey(
        Order, on_delete=models.CASCADE, related_name='final')
    full = models.ImageField(upload_to=name_files_container)
    semi_close = models.ImageField(
        upload_to=name_files_container, null=True, blank=True)
    close = models.ImageField(
        upload_to=name_files_container, null=True, blank=True)
    precinto = models.ImageField(
        upload_to=name_files_container, null=True, blank=True)
    uploaded_at = models.DateTimeField(auto_now=True)

    def get_file_extension(self, name):
        # Get the file extension
        return f".{name.split('.')[-1]}"

    def save(self, *args, **kwargs):
        '''
            Change the name of images.
        '''
        full_name = f"{self.order.id}-contenedor-lleno"
        # Change the name of image
        if full_name not in self.full.name:
            self.full.name = full_name + \
                f"{self.get_file_extension(self.full.name)}"
        if self.semi_close:
            semi_close_name = f"{self.order.id}-contenedor-semicerrado"
            if semi_close_name not in self.semi_close.name:
                self.semi_close.name = semi_close_name + \
                    f"{self.get_file_extension(self.semi_close.name)}"
        if self.close:
            close_name = f"{self.order.id}-contenedor-cerrado"
            if close_name not in self.close.name:
                self.close.name = close_name + \
                    f"{self.get_file_extension(self.close.name)}"
        if self.precinto:
            precinto_name = f"{self.order.id}-contenedor-precinto"
            if precinto_name not in self.precinto.name:
                self.precinto.name = precinto_name + \
                    f"{self.get_file_extension(self.precinto.name)}"
        super(CloseOrder, self).save(*args, **kwargs)


def name_files_control(instance, filename):
    return f"carga_{instance.order.id}/control/{instance.control}/{filename}"


class ImageControl(models.Model):
    TYPE_OPTIONS = [
        ("temperature", "temperature"),
        ("weight", "weight"),
        ("measure", "measure"),
    ]

    order = models.ForeignKey(
        Order,
        on_delete=models.CASCADE,
        related_name='images')
    control = models.CharField(choices=TYPE_OPTIONS, max_length=15)
    number = models.PositiveIntegerField(default=0)
    image = models.ImageField(upload_to=name_files_control)
    display = models.BooleanField(default=False)
    uploaded_at = models.DateTimeField(auto_now=True)

    def get_file_extension(self, name):
        # Get the file extension
        return f".{name.split('.')[-1]}"

    def save(self, *args, **kwargs):
        '''
            Change the name of images.
        '''

        # Change the name of image
        image_name = f"{self.order.id}-{self.control}{self.number}"
        if image_name not in self.image.name:
            self.image.name = image_name + \
                f"{self.get_file_extension(self.image.name)}"
        super(ImageControl, self).save(*args, **kwargs)
