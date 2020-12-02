from rest_framework.serializers import ModelSerializer, PrimaryKeyRelatedField

from .models import (
    Order,
    Product,
    ContainerOrder,
    CloseOrder,
    RowOrder,
    TemperatureControl,
    WeightControl,
    OrganolepticControl,
    ImageControl
)
from registration.models import Client, Inspector
from registration.serializers import ClientSerializer, InspectorSerializer


class ProductSerializer(ModelSerializer):
    class Meta:
        model = Product
        fields = "__all__"


class ContainerOrderSerializer(ModelSerializer):
    order = PrimaryKeyRelatedField(read_only=True)

    class Meta:
        model = ContainerOrder
        fields = "__all__"

    def create(self, validated_data):
        order_id = self.context["request"].data.get("order")
        order = Order.objects.get(pk=order_id)
        if order.initial.exists():
            raise ValueError("This order already has a Container Data")
        container = ContainerOrder.objects.create(
            order=order, **validated_data)
        return container


class CloseOrderSerializer(ModelSerializer):
    order = PrimaryKeyRelatedField(read_only=True)

    class Meta:
        model = CloseOrder
        fields = "__all__"

    def create(self, validated_data):
        order_id = self.context["request"].data.get("order")
        order = Order.objects.get(pk=order_id)
        if order.final.exists():
            raise ValueError("This order already has a Close Data")
        container = CloseOrder.objects.create(order=order, **validated_data)
        return container


class OrderSerializer(ModelSerializer):
    client = ClientSerializer(read_only=True)
    inspector = InspectorSerializer(read_only=True)
    products = ProductSerializer(many=True, read_only=True)
    initial = ContainerOrderSerializer(read_only=True, many=True)
    final = CloseOrderSerializer(read_only=True, many=True)

    class Meta:
        model = Order
        fields = "__all__"

    def create(self, validated_data):
        client = Client.objects.get(
            user__id=self.context["request"].data.pop("client"))
        inspector = Inspector.objects.get(
            user__id=self.context["request"].data.pop("inspector"))
        products = self.context["request"].data.pop("products")

        order = Order.objects.create(
            **validated_data, client=client, inspector=inspector)

        for prod in products:
            order.products.add(Product.objects.get(id=prod))

        return order

    def update(self, instance, validated_data):
        client = self.context["request"].data.get("client", None)
        inspector = self.context["request"].data.get("inspector", None)
        products = self.context["request"].data.get("products", [])
        # Update the Order data
        order = super().update(instance, validated_data)
        if client and str(order.client.pk) != client:
            order.client = Client.objects.get(pk=client)

        if inspector and str(order.inspector.pk) != inspector:
            order.inspector = Inspector.objects.get(pk=inspector)

        if products:
            # Remove the products that are not in products
            for p in order.products.select_related():
                if str(p.pk) not in products:
                    order.products.remove(p)
                else:
                    products.remove(str(p.pk))

            # Add the products to order
            for p in products:
                order.products.add(Product.objects.get(id=p))

        order.save()
        return order


class RowOrderSerializer(ModelSerializer):
    product = ProductSerializer(read_only=True)

    class Meta:
        model = RowOrder
        fields = "__all__"
        read_only_fields = ['order']

    def create(self, validated_data):
        # Get the order nad the prooduct form request
        order = Order.objects.get(pk=self.context["request"].data.get("order"))
        product = Product.objects.get(
            pk=self.context["request"].data.get("product"))
        # Create row and return
        row = RowOrder.objects.create(
            **validated_data, order=order, product=product)
        return row

    def update(self, instance, validated_data):
        product = self.context["request"].data.get("product", None)
        # Update the RowOrder data
        row = super().update(instance, validated_data)

        if (product and (str(row.product.pk) != product)):
            # Add the products to row
            row.product = Product.objects.get(id=product)

        row.save()
        return row


class ImageControlSerializer(ModelSerializer):
    class Meta:
        model = ImageControl
        fields = "__all__"


class TempControlSerializer(ModelSerializer):
    images = ImageControlSerializer(many=True, read_only=True)

    class Meta:
        model = TemperatureControl
        fields = "__all__"
        read_only_fields = ['order', 'images']

    def create(self, validated_data):
        # Get the order nad the prooduct form request
        order = Order.objects.get(pk=self.context["request"].data.get("order"))
        # Create row and return
        temp = TemperatureControl.objects.create(**validated_data, order=order)
        return temp


class WeightControlSerializer(ModelSerializer):
    images = ImageControlSerializer(many=True, read_only=True)

    class Meta:
        model = WeightControl
        fields = "__all__"
        read_only_fields = ['order', 'images']

    def create(self, validated_data):
        # Get the order nad the prooduct form request
        order = Order.objects.get(pk=self.context["request"].data.get("order"))
        # Create row and return
        weight = WeightControl.objects.create(**validated_data, order=order)
        return weight


class OrganolepticControlSerializer(ModelSerializer):
    images = ImageControlSerializer(many=True, read_only=True)

    class Meta:
        model = OrganolepticControl
        fields = "__all__"
        read_only_fields = ['order', 'images']

    def create(self, validated_data):
        # Get the order nad the prooduct form request
        order = Order.objects.get(pk=self.context["request"].data.get("order"))
        # Create row and return
        measure = OrganolepticControl.objects.create(
            **validated_data, order=order)
        return measure
