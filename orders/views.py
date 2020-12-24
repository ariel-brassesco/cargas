import datetime
from rest_framework import status
from rest_framework.parsers import MultiPartParser, FormParser
from rest_framework.decorators import api_view, permission_classes, action
from rest_framework.permissions import IsAdminUser, IsAuthenticated
from rest_framework.response import Response
from rest_framework.generics import CreateAPIView
from rest_framework.viewsets import ModelViewSet
from django.http import HttpResponse
from django.conf import settings
from .utils import (
    get_files_from_init,
    get_files_from_final,
    get_files_from_rows,
    get_files_from_control,
    save_files_zip
)

from .serializers import (
    OrderSerializer,
    ProductSerializer,
    ContainerOrderSerializer,
    CloseOrderSerializer,
    RowOrderSerializer,
    TempControlSerializer,
    WeightControlSerializer,
    OrganolepticControlSerializer,
    ImageControlSerializer
)
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
from .pagination import OrdersPagination
# Create your views here.


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
    queryset = Order.objects.exclude(
        status__in=["cancel", "ready"]).order_by('-date')
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
            gross_weight = request.data.get("gross_weight", 0)
            net_weight = request.data.get("net_weight", 0)
            boxes = request.data.get("boxes", 0)
            seal = request.data.get("seal", "")
            lot = request.data.get("lot", "")
            # Create ContainerOrder
            serial_container = CloseOrderSerializer(
                data=request.data,
                context={"request": request}
            )
            serial_container.is_valid(raise_exception=True)
            container = serial_container.save()
            # Set the order state in finish
            container.order.status = "finish"
            container.order.gross_weight = gross_weight
            container.order.net_weight = net_weight
            container.order.boxes = boxes
            container.order.seal = seal
            container.order.lot = lot
            container.order.save()
            # Serialize Order and Send
            serializer = self.get_serializer(container.order)
            headers = self.get_success_headers(serializer.data)
            return Response(serializer.data, status=status.HTTP_201_CREATED, headers=headers)
        except Exception as error:
            print(error)
            return Response(status=status.HTTP_400_BAD_REQUEST)

    # def update(self, request, *args, **kwargs):
    #     print(request.data)
    #     partial = kwargs.pop('partial', False)

    #     instance = self.get_object()
    #     serializer = self.get_serializer(instance, data=request.data, partial=partial)
    #     serializer.is_valid(raise_exception=True)
    #     self.perform_update(serializer)
    #     print(serializer.data)
    #     return Response(serializer.data)


class ClientOrderViewSet(ModelViewSet):
    queryset = Order.objects.exclude(is_active=False).order_by('-date')
    serializer_class = OrderSerializer
    permission_classes = [IsAuthenticated]

    def list(self, request, *args, **kwargs):
        if not request.query_params.get("client"):
            return Response(status=status.HTTP_400_BAD_REQUEST)
        # Set date to retreive orders
        delta_days = datetime.timedelta(days=settings.DAYS_ALLOW_CLIENT_ORDER)
        date = datetime.datetime.now() - delta_days

        queryset = self.filter_queryset(
            self.get_queryset()
        ).filter(client__pk=request.query_params.get("client"), date__gt=date)

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

    def perform_create(self, serializer):
        return serializer.save()

    def get_permissions(self):
        """
        Instantiates and returns the list of permissions that this view requires.
        """
        if self.action == "destroy":
            permission_classes = [IsAdminUser]
        else:
            # if (not self.request.user.is_client):
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
        serializer.is_valid(raise_exception=False)
        control = self.perform_create(serializer)
        # Load Images
        images = request.FILES.getlist("images")
        order = Order.objects.get(pk=request.data.get("order"))
        row = request.data.get("row")
        for img in images:
            image = ImageControl.objects.create(
                order=order,
                number=row,
                image=img,
                control="temperature"
            )
            control.images.add(image)
        # Send the response
        headers = self.get_success_headers(serializer.data)
        return Response(serializer.data, status=status.HTTP_201_CREATED, headers=headers)


class WeightControlViewSet(ModelViewSet):
    queryset = WeightControl.objects.all()
    serializer_class = WeightControlSerializer

    def perform_create(self, serializer):
        return serializer.save()

    def get_permissions(self):
        """
        Instantiates and returns the list of permissions that this view requires.
        """
        if self.action == "destroy":
            permission_classes = [IsAdminUser]
        else:
            # if (not self.request.user.is_client):
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
        control = self.perform_create(serializer)
        # Load Images
        images = request.FILES.getlist("images")
        order = Order.objects.get(pk=request.data.get("order"))
        for img in images:
            image = ImageControl.objects.create(
                order=order,
                image=img,
                control="weight"
            )
            control.images.add(image)
        # Send the response
        headers = self.get_success_headers(serializer.data)
        return Response(serializer.data, status=status.HTTP_201_CREATED, headers=headers)


class OrganolepticControlViewSet(ModelViewSet):
    queryset = OrganolepticControl.objects.all()
    serializer_class = OrganolepticControlSerializer

    def perform_create(self, serializer):
        return serializer.save()

    def get_permissions(self):
        """
        Instantiates and returns the list of permissions that this view requires.
        """
        if self.action == "destroy":
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
        control = self.perform_create(serializer)
        # Load Images
        images = request.FILES.getlist("images")
        order = Order.objects.get(pk=request.data.get("order"))
        for img in images:
            image = ImageControl.objects.create(
                order=order,
                image=img,
                control="measure"
            )
            control.images.add(image)

        # Send the response
        headers = self.get_success_headers(serializer.data)
        return Response(serializer.data, status=status.HTTP_201_CREATED, headers=headers)


class ContainerOrderViewSet(ModelViewSet):
    queryset = ContainerOrder.objects.all()
    serializer_class = ContainerOrderSerializer

    def get_permissions(self):
        """
        Instantiates and returns the list of permissions that this view requires.
        """
        if self.action == "destroy":
            permission_classes = [IsAdminUser]
        else:
            if (not self.request.user.is_client):
                permission_classes = [IsAuthenticated]
        return [permission() for permission in permission_classes]

    def perform_update(self, serializer):
        return serializer.save()

    def update(self, request, *args, **kwargs):
        partial = kwargs.pop('partial', False)

        instance = self.get_object()
        serializer = self.get_serializer(
            instance, data=request.data, partial=partial)
        serializer.is_valid(raise_exception=True)
        container = self.perform_update(serializer)

        order = OrderSerializer(container.order)

        return Response(order.data)


class CloseOrderViewSet(ModelViewSet):
    queryset = CloseOrder.objects.all()
    serializer_class = CloseOrderSerializer

    def get_permissions(self):
        """
        Instantiates and returns the list of permissions that this view requires.
        """
        if self.action in ("create", "destroy"):
            permission_classes = [IsAdminUser]
        else:
            if (not self.request.user.is_client):
                permission_classes = [IsAuthenticated]
        return [permission() for permission in permission_classes]

    def perform_update(self, serializer):
        return serializer.save()

    def update(self, request, *args, **kwargs):
        partial = kwargs.pop('partial', False)

        instance = self.get_object()
        serializer = self.get_serializer(
            instance, data=request.data, partial=partial)
        serializer.is_valid(raise_exception=False)
        close = self.perform_update(serializer)

        order = OrderSerializer(close.order)

        return Response(order.data)


class ImageControlViewSet(ModelViewSet):
    queryset = ImageControl.objects.all()
    serializer_class = ImageControlSerializer

    def list(self, request, *args, **kwargs):
        order = request.query_params.get("order")
        if not order:
            return Response(status=status.HTTP_400_BAD_REQUEST)

        queryset = self.filter_queryset(
            self.get_queryset()
        ).filter(order__pk=order)

        if request.user.is_client:
            queryset = queryset.filter(display=True)

        page = self.paginate_queryset(queryset)
        if page is not None:
            serializer = self.get_serializer(page, many=True)
            return self.get_paginated_response(serializer.data)

        serializer = self.get_serializer(queryset, many=True)
        return Response(serializer.data)


@api_view(["GET"])
@permission_classes([IsAuthenticated])
def get_rows_photos(request):
    try:
        order = request.query_params.get("order")
        rows = RowOrder.objects.filter(order__pk=order, display=True)
        serializer = RowOrderSerializer(rows, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)
    except:
        return Response(status=status.HTTP_400_BAD_REQUEST)


@api_view(["GET"])
@permission_classes([IsAuthenticated])
def download_images(request):
    from zipfile38 import ZipFile

    order_id = request.query_params.get("order")
    order = Order.objects.get(id=order_id)

    rows = RowOrder.objects.filter(order__pk=order_id, display=True)
    images = ImageControl.objects.filter(order__pk=order_id, display=True)
    initial = ContainerOrder.objects.filter(order__pk=order_id).first()
    final = CloseOrder.objects.filter(order__pk=order_id).first()

    zip_name = f"{order.order}.zip" if order.order else f"Carga_{order.id}.zip"
    response = HttpResponse(content_type='application/zip')
    # response = Response(content_type='application/zip')
    with ZipFile(response, "w") as zip_file:
        if initial:
            files = get_files_from_init(initial)
            save_files_zip(zip_file, files)

        if final:
            files = get_files_from_final(final)
            save_files_zip(zip_file, files)
        if rows.exists():
            files = get_files_from_rows(rows)
            save_files_zip(zip_file, files)
        if images.exists():
            files = get_files_from_control(images)
            save_files_zip(zip_file, files)

    # zip_file = ZipFile(zip_name, "r")
    # response = Response(
    #     data=zip_file.read(zip_name),
    #     status=status.HTTP_200_OK,
    #     content_type='application/zip'
    # )
    # response.status_code = status.HTTP_200_OK
    response['Content-Disposition'] = f'attachment; filename={zip_name}'

    return response

    # return Response(status=status.HTTP_400_BAD_REQUEST)
