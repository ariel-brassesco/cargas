from django.urls import path
from .views import ClientViewSet, InspectorViewSet
from . import views

app_name = "registration"

client_list = ClientViewSet.as_view({"get": "list", "post": "create"})
client_detail = ClientViewSet.as_view(
    {
        "get": "retrieve",
        "put": "update",
        "patch": "partial_update",
        "delete": "destroy",
    }
)

inspector_list = InspectorViewSet.as_view({"get": "list", "post": "create"})
inspector_detail = InspectorViewSet.as_view(
    {
        "get": "retrieve",
        "put": "update",
        "patch": "partial_update",
        "delete": "destroy",
    }
)

urlpatterns = [
    path("me", views.me, name="me"),
    path("clients/", client_list),
    path("clients/<int:pk>/", client_detail),
    path("inspectors/", inspector_list),
    path("inspectors/<int:pk>/", inspector_detail),
    path("validate_username/", views.validate_username),
    path("send_credentials/", views.send_credentials),
]