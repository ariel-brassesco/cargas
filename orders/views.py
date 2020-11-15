from rest_framework import status
from rest_framework.parsers import MultiPartParser, FormParser
from rest_framework.decorators import api_view, permission_classes, action
from rest_framework.permissions import IsAdminUser, IsAuthenticated
from rest_framework.response import Response
from rest_framework.generics import CreateAPIView
from rest_framework.viewsets import ModelViewSet

from .serializers import (
    OrderSerializer, 
    ProductSerializer, 
    ContainerOrderSerializer,
    CloseOrderSerializer,
    RowOrderSerializer,
    TempControlSerializer,
    WeightControlSerializer
)
from .models import (
    Order, 
    Product, 
    ContainerOrder, 
    RowOrder, 
    TemperatureControl, 
    WeightControl,
    ImageControl
)
from registration.models import Client, Inspector
from registration.serializers import ClientSerializer, InspectorSerializer
from .pagination import OrdersPagination
# Create your views here.

# @api_view(["GET"])
# @permission_classes([IsAuthenticated])
# def get_order_client(request, pk):
#     orders = Order.objects.filter(client=pk)
#     serializer = OrderSerializer(orders, many=True)
#     return Response(serializer.data, status=status.HTTP_200_OK)

# @api_view(["GET"])
# @permission_classes([IsAuthenticated])
# def get_order_inspector(request, pk):
#     if request.user.is_client: return Response(status=status.HTTP_401_UNAUTHORIZED)
#     orders = Order.objects.filter(inspector=pk)
#     serializer = OrderSerializer(orders, many=True)
#     return Response(serializer.data, status=status.HTTP_200_OK)

class ProductViewSet(ModelViewSet):
    queryset = Product.objects.all()
    serializer_class = ProductSerializer
    permission_classes = [IsAdminUser]

class OrderViewSet(ModelViewSet):
    queryset = Order.objects.all().order_by('-date')
    serializer_class = OrderSerializer
    permission_classes = [IsAdminUser]
    pagination_class = OrdersPagination

class InspectorOrderViewSet(ModelViewSet):
    queryset = Order.objects.exclude(status__in=["cancel", "ready"]).order_by('-date')
    serializer_class = OrderSerializer
    permission_classes = [IsAuthenticated]

    def list(self, request, *args, **kwargs):
        if not request.query_params.get("inspector"):
            return Response(status=status.HTTP_400_BAD_REQUEST)
        
        queryset = self.filter_queryset(
            self.get_queryset()
            ).filter(inspector__pk=request.query_params.get("inspector"))

        page = self.paginate_queryset(queryset)
        if page is not None:
            serializer = self.get_serializer(page, many=True)
            return self.get_paginated_response(serializer.data)

        serializer = self.get_serializer(queryset, many=True)
        return Response(serializer.data)

    @action(detail=False, methods=["post"])
    def init_order(self, request):
        try:
            # Get the Container Matricular from request.data
            matricula = request.data.get("container")
            # Create ContainerOrder
            serial_container = ContainerOrderSerializer(
                data=request.data,
                context={"request": request}
            )
            serial_container.is_valid(raise_exception=True)
            container = serial_container.save()
            # Set the container matricula in Order
            # and set the order state in initiating
            container.order.container = matricula
            container.order.status = "initiating"
            container.order.save()
            # Serialize Order and Send
            serializer = self.get_serializer(container.order)
            headers = self.get_success_headers(serializer.data)
            return Response(serializer.data, status=status.HTTP_201_CREATED, headers=headers)
        except Exception as error:
            print(error)
            return Response(status=status.HTTP_400_BAD_REQUEST)
        
    @action(detail=False, methods=["post"])
    def close_order(self, request):
        try:
            # Create ContainerOrder
            serial_container = CloseOrderSerializer(
                data=request.data,
                context={"request": request}
            )
            serial_container.is_valid(raise_exception=True)
            container = serial_container.save()
            # Set the order state in finish
            container.order.status = "finish"
            container.order.save()
            # Serialize Order and Send
            serializer = self.get_serializer(container.order)
            headers = self.get_success_headers(serializer.data)
            return Response(serializer.data, status=status.HTTP_201_CREATED, headers=headers)
        except Exception as error:
            print(error)
            return Response(status=status.HTTP_400_BAD_REQUEST)

class ClientOrderViewSet(ModelViewSet):
    queryset = Order.objects.exclude(status__in=["cancel", "ready"]).order_by('-date')
    serializer_class = OrderSerializer
    permission_classes = [IsAuthenticated]

    def list(self, request, *args, **kwargs):
        if not request.query_params.get("client"):
            return Response(status=status.HTTP_400_BAD_REQUEST)
        
        queryset = self.filter_queryset(
            self.get_queryset()
            ).filter(client__pk=request.query_params.get("client"))

        page = self.paginate_queryset(queryset)
        if page is not None:
            serializer = self.get_serializer(page, many=True)
            return self.get_paginated_response(serializer.data)

        serializer = self.get_serializer(queryset, many=True)
        return Response(serializer.data)
    
class RowOrderViewSet(ModelViewSet):
    queryset = RowOrder.objects.all()
    serializer_class = RowOrderSerializer

    def get_permissions(self):
        """
        Instantiates and returns the list of permissions that this view requires.
        """
        if self.action == "delete":
            permission_classes = [IsAdminUser]
        else:
            if (not self.request.user.is_client):
                permission_classes = [IsAuthenticated]
        return [permission() for permission in permission_classes]

    def list(self, request, *args, **kwargs):
        order = request.query_params.get("order")
        if not order:
            return Response(status=status.HTTP_400_BAD_REQUEST)
        
        queryset = self.filter_queryset(
            self.get_queryset()
            ).filter(order__pk=order)

        page = self.paginate_queryset(queryset)
        if page is not None:
            serializer = self.get_serializer(page, many=True)
            return self.get_paginated_response(serializer.data)

        serializer = self.get_serializer(queryset, many=True)
        return Response(serializer.data)

class TempControlViewSet(ModelViewSet):
    queryset = TemperatureControl.objects.all()
    serializer_class = TempControlSerializer

    def get_permissions(self):
        """
        Instantiates and returns the list of permissions that this view requires.
        """
        if self.action == "delete":
            permission_classes = [IsAdminUser]
        else:
            if (not self.request.user.is_client):
                permission_classes = [IsAuthenticated]
        return [permission() for permission in permission_classes]

    def list(self, request, *args, **kwargs):
        order = request.query_params.get("order")
        if not order:
            return Response(status=status.HTTP_400_BAD_REQUEST)
        
        queryset = self.filter_queryset(
            self.get_queryset()
            ).filter(order__pk=order)

        page = self.paginate_queryset(queryset)
        if page is not None:
            serializer = self.get_serializer(page, many=True)
            return self.get_paginated_response(serializer.data)

        serializer = self.get_serializer(queryset, many=True)
        return Response(serializer.data)

    def create(self, request, *args, **kwargs):
        # Create Temperature Control
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        self.perform_create(serializer)
        # Load Images
        images = request.FILES.getlist("images")
        order = Order.objects.get(pk=request.data.get("order"))
        row = request.data.get("row")
        for img in images:
            ImageControl.objects.create(
                order=order,
                number = row,
                image=img, 
                control="temperature"
            )
        # Send the response
        headers = self.get_success_headers(serializer.data)
        return Response(serializer.data, status=status.HTTP_201_CREATED, headers=headers)

class WeightControlViewSet(ModelViewSet):
    queryset = WeightControl.objects.all()
    serializer_class = WeightControlSerializer

    def get_permissions(self):
        """
        Instantiates and returns the list of permissions that this view requires.
        """
        if self.action == "delete":
            permission_classes = [IsAdminUser]
        else:
            if (not self.request.user.is_client):
                permission_classes = [IsAuthenticated]
        return [permission() for permission in permission_classes]

    def list(self, request, *args, **kwargs):
        order = request.query_params.get("order")
        if not order:
            return Response(status=status.HTTP_400_BAD_REQUEST)
        
        queryset = self.filter_queryset(
            self.get_queryset()
            ).filter(order__pk=order)

        page = self.paginate_queryset(queryset)
        if page is not None:
            serializer = self.get_serializer(page, many=True)
            return self.get_paginated_response(serializer.data)

        serializer = self.get_serializer(queryset, many=True)
        return Response(serializer.data)

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        self.perform_create(serializer)
        # Load Images
        images = request.FILES.getlist("images")
        order = Order.objects.get(pk=request.data.get("order"))
        for img in images:
            ImageControl.objects.create(
                order=order,
                image=img, 
                control="weights"
            )
        # Send the response
        headers = self.get_success_headers(serializer.data)
        return Response(serializer.data, status=status.HTTP_201_CREATED, headers=headers)

