from django.urls import path
from .views import OrderViewSet, ProductViewSet
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

urlpatterns = [
    path("inspector/<int:pk>/", views.get_order_inspector),
    path("client/<int:pk>/", views.get_order_client),
    path("admin/", order_list),
    path("admin/<int:pk>/", order_detail),
    path("products/", product_list),
    path("products/<int:pk>/", product_detail),
]