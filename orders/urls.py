from django.urls import path
from .views import (
    OrderViewSet,
    ProductViewSet,
    InspectorOrderViewSet,
    ClientOrderViewSet,
    RowOrderViewSet,
    TempControlViewSet,
    WeightControlViewSet,
    OrganolepticControlViewSet,
    ContainerOrderViewSet,
    CloseOrderViewSet,
    ImageControlViewSet,
    get_rows_photos,
    get_control_photos
)

app_name = "orders"

order_list = OrderViewSet.as_view({"get": "list", "post": "create"})
order_detail = OrderViewSet.as_view(
    {
        "get": "retrieve",
        "put": "update",
        "patch": "partial_update",
        "delete": "destroy",
    }
)

product_list = ProductViewSet.as_view({"get": "list", "post": "create"})
product_detail = ProductViewSet.as_view(
    {
        "get": "retrieve",
        "put": "update",
        "patch": "partial_update",
        "delete": "destroy",
    }
)

inspector_list = InspectorOrderViewSet.as_view(
    {"get": "list", "post": "init_order"})
inspector_close = InspectorOrderViewSet.as_view({"post": "close_order"})
inspector_detail = InspectorOrderViewSet.as_view({"patch": "partial_update"})

client_list = ClientOrderViewSet.as_view({"get": "list"})

rows_list = RowOrderViewSet.as_view({"get": "list", "post": "create"})
temps_list = TempControlViewSet.as_view({"get": "list", "post": "create"})
weights_list = WeightControlViewSet.as_view({"get": "list", "post": "create"})
measures_list = OrganolepticControlViewSet.as_view(
    {"get": "list", "post": "create"})

rows_detail = RowOrderViewSet.as_view(
    {"patch": "partial_update", "delete": "destroy"})
container_detail = ContainerOrderViewSet.as_view({"patch": "partial_update"})
close_container_detail = CloseOrderViewSet.as_view({"patch": "partial_update"})

images_list = ImageControlViewSet.as_view({"get": "list"})
images_detail = ImageControlViewSet.as_view({"patch": "partial_update"})

urlpatterns = [
    path("admin/images/", images_list),
    path("admin/images/<int:pk>/", images_detail),
    path("admin/rows/", rows_list),
    path("admin/rows/<int:pk>/", rows_detail),
    path("admin/temps/", temps_list),
    path("admin/weights/", weights_list),
    path("admin/measures/", measures_list),
    path("admin/", order_list),
    path("admin/<int:pk>/", order_detail),
    path("products/", product_list),
    path("products/<int:pk>/", product_detail),
    path("inspector/rows/", rows_list),
    path("inspector/rows/<int:pk>/", rows_detail),
    path("inspector/temps/", temps_list),
    path("inspector/weights/", weights_list),
    path("inspector/measures/", measures_list),
    path("inspector/close/", inspector_close),
    path("inspector/container/<int:pk>/", container_detail),
    path("inspector/close/<int:pk>/", close_container_detail),
    path("inspector/", inspector_list),
    path("inspector/<int:pk>/", inspector_detail),
    path("client/", client_list),
    path("client/control/", get_control_photos),
    path("client/rows/", get_rows_photos),
]
