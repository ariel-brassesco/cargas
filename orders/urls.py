from django.urls import path
from .views import (
    OrderViewSet, 
    ProductViewSet, 
    InspectorOrderViewSet, 
    ClientOrderViewSet,
    RowOrderViewSet,
    TempControlViewSet,
    WeightControlViewSet
)
from . import views

app_name = "orders"

order_list = OrderViewSet.as_view({ "get": "list", "post": "create" })
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

inspector_list = InspectorOrderViewSet.as_view({ "get": "list", "post": "init_order"})
inspector_close = InspectorOrderViewSet.as_view({ "post": "close_order"})
inspector_detail = InspectorOrderViewSet.as_view({"patch": "partial_update"})

client_list = ClientOrderViewSet.as_view({ "get": "list"})

rows_list = RowOrderViewSet.as_view({"get": "list", "post": "create"})
temps_list = TempControlViewSet.as_view({"get": "list", "post": "create"})
weights_list = WeightControlViewSet.as_view({"get": "list", "post": "create"})

urlpatterns = [
    # path("inspector/<int:pk>/", views.get_order_inspector),
    # path("client/<int:pk>/", views.get_order_client),
    path("admin/", order_list),
    path("admin/<int:pk>/", order_detail),
    path("products/", product_list),
    path("products/<int:pk>/", product_detail),
    path("inspector/rows/", rows_list),
    path("inspector/temps/", temps_list),
    path("inspector/weights/", weights_list),
    path("inspector/close/", inspector_close),
    path("inspector/", inspector_list),
    path("inspector/<int:pk>/", inspector_detail),
    path("client/", client_list),
]