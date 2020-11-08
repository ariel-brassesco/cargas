from rest_framework import status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAdminUser, IsAuthenticated
from rest_framework.response import Response
from rest_framework.viewsets import ModelViewSet

from django.core.mail import send_mail

from .models import User, Client, Inspector, Address
from .serializers import ClientSerializer, UserSerializer, InspectorSerializer


@api_view(["GET"])
@permission_classes([IsAuthenticated])
def me(request):
    serializer = UserSerializer(request.user)
    return Response(serializer.data)

@api_view(["POST"])
@permission_classes([IsAdminUser])
def send_credentials(request):
    user_id = request.data.pop('id', None)
    try:
        user = User.objects.get(id=user_id)
        user.send_credentials()
    except User.DoesNotExist:
        return Response({"ok": False})
    return Response({"ok": True})

@api_view(["GET"])
def validate_username(request):
    user_id = request.GET.get('id', None)
    username = request.GET.get('username', None)
    res = User.objects.filter(username=username, is_active=True).exclude(id=user_id).exists()
    return Response({"ok": not res})

class ClientViewSet(ModelViewSet):
    queryset = Client.objects.all()
    serializer_class = ClientSerializer
    
    def update(self, request, *args, **kwargs):
        partial = kwargs.pop('partial', False)
        instance = self.get_object()
        # Extract Main Data
        user = request.data.pop('user', None)
        address = request.data.pop('address', None)
        # Only collect the data change
        # Client Data
        data = {k:v for k, v in request.data.items() if v != getattr(instance, k)}
        # User Data
        if user: data['user'] = {
            k: v for k, v in user.items() 
            if v != getattr(instance.user, k)
            }
        # Address Data
        if isinstance(address, dict):
            data['address'] = {
                k: v for k, v in address.items() 
                if not (instance.address and v == getattr(instance.address, k))
                }
        if not address and instance.address: data['address'] = None
        serializer = self.get_serializer(instance, data=data, partial=True)
        serializer.is_valid(raise_exception=True)
        self.perform_update(serializer)
        return Response(serializer.data)

    def destroy(self, request, *args, **kwargs):
        instance = self.get_object()
        instance.perform_delete()
        return Response(status=status.HTTP_204_NO_CONTENT)

class InspectorViewSet(ModelViewSet):
    queryset = Inspector.objects.all()
    serializer_class = InspectorSerializer

    def update(self, request, *args, **kwargs):
        partial = kwargs.pop('partial', False)
        instance = self.get_object()
        # Extract Main Data
        user = request.data.pop('user', None)
        address = request.data.pop('address', None)
        # Only collect the data change
        # Inspector Data
        data = {k:v for k, v in request.data.items() if v != getattr(instance, k)}
        # User Data
        if user: data['user'] = {
            k: v for k, v in user.items() 
            if v != getattr(instance.user, k)
            }
        # Address Data
        if isinstance(address, dict):
            data['address'] = {
                k: v for k, v in address.items() 
                if not (instance.address and v == getattr(instance.address, k))
                }
        if not address and instance.address: data['address'] = None
        serializer = self.get_serializer(instance, data=data, partial=True)
        serializer.is_valid(raise_exception=True)
        self.perform_update(serializer)
        return Response(serializer.data)

    def destroy(self, request, *args, **kwargs):
        instance = self.get_object()
        instance.perform_delete()
        return Response(status=status.HTTP_204_NO_CONTENT)
