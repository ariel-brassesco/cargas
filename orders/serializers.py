from rest_framework.serializers import ModelSerializer

from .models import Order, Product
from registration.models import Client, Inspector
from registration.serializers import ClientSerializer, InspectorSerializer

class ProductSerializer(ModelSerializer):
    class Meta:
        model = Product
        fields = "__all__"

class OrderSerializer(ModelSerializer):
    client = ClientSerializer(read_only=True)
    inspector = InspectorSerializer(read_only=True)
    products = ProductSerializer(many=True, read_only=True)

    class Meta:
        model = Order
        fields = "__all__"

    def create(self, validated_data):
        client = Client.objects.get(user__id=self.context["request"].data.pop("client"))
        inspector = Inspector.objects.get(user__id=self.context["request"].data.pop("inspector"))
        products = self.context["request"].data.pop("products")
        
        order = Order.objects.create(**validated_data, client=client, inspector=inspector)

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

        for p in order.products.select_related():
            if str(p.pk) not in products:
                order.products.remove(p)
            else:

                products.remove(str(p.pk))

        for p in products: 
            order.products.add(Product.objects.get(id=p))

        order.save()
        return order
