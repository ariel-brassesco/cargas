from django.urls import path
from .views import OrderViewSet, OrderDataViewSet, ProductViewSet
from . import views

app_name = "orders"

order_create = OrderViewSet.as_view({ "post": "create" })
order_update = OrderViewSet.as_view(
    {
        "put": "update",
        "patch": "partial_update",
        "delete": "destroy",
    }
)

order_list = OrderDataViewSet.as_view({ "get": "list", "post": "create" })
order_detail = OrderDataViewSet.as_view(
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

urlpatterns = [
    path("inspector/<int:pk>/", views.get_order_inspector),
    path("client/<int:pk>/", views.get_order_client),
    # path("admin/new_order/", order_create),
    # path("admin/update/<int:pk>/", order_update),
    path("admin/", order_list),
    path("admin/<int:pk>/", order_detail),
    path("products/", product_list),
    path("products/<int:pk>/", product_detail),
]