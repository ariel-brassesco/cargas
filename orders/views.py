from rest_framework import status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAdminUser, IsAuthenticated
from rest_framework.response import Response
from rest_framework.generics import CreateAPIView
from rest_framework.viewsets import ModelViewSet

from .serializers import OrderSerializer, ProductSerializer
from .models import Order, Product
from registration.models import Client, Inspector
from registration.serializers import ClientSerializer, InspectorSerializer
from .pagination import OrdersPagination
# Create your views here.

@api_view(["GET"])
@permission_classes([IsAuthenticated])
def get_order_client(request, pk):
    orders = Order.objects.filter(client=pk)
    serializer = OrderSerializer(orders, many=True)
    return Response(serializer.data, status=status.HTTP_200_OK)

@api_view(["GET"])
@permission_classes([IsAuthenticated])
def get_order_inspector(request, pk):
    if request.user.is_client: return Response(status=status.HTTP_401_UNAUTHORIZED)
    orders = Order.objects.filter(client=pk)
    serializer = OrderSerializer(orders, many=True)
    return Response(serializer.data, status=status.HTTP_200_OK)

class ProductViewSet(ModelViewSet):
    queryset = Product.objects.all()
    serializer_class = ProductSerializer
    permission_classes = [IsAdminUser]

class OrderViewSet(ModelViewSet):
    queryset = Order.objects.all().order_by('-date')
    serializer_class = OrderSerializer
    permission_classes = [IsAdminUser]
    pagination_class = OrdersPagination
