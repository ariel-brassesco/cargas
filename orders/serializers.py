from rest_framework.serializers import ModelSerializer

from .models import Order, Product
from registration.serializers import ClientSerializer, InspectorSerializer

class ProductSerializer(ModelSerializer):
    class Meta:
        model = Product
        fields = "__all__"

class OrderSerializer(ModelSerializer):
    class Meta:
        model = Order
        fields = "__all__"

class OrderDataSerializer(ModelSerializer):
    client = ClientSerializer(read_only=True)
    inspector = InspectorSerializer(read_only=True)
    class Meta:
        model = Order
        fields = "__all__"
