from rest_framework.serializers import ModelSerializer, StringRelatedField, ValidationError
from django.db import IntegrityError

from .models import User, Client, Inspector, Address

class AddressSerializer(ModelSerializer):
    class Meta:
        model = Address
        fields = [ 'id', 'address' ]

class UserSerializer(ModelSerializer):
    class Meta:
        model = User
        fields = [
            'id',
            'username',
            'first_name',
            'last_name',
            'email',
            'user_type'
        ]

class InspectorSerializer(ModelSerializer):
    '''
        Serialize the data of client.
    '''
    user = UserSerializer()
    address = AddressSerializer(allow_null=True)

    class Meta:
        model = Inspector
        fields = '__all__'

    def update(self, instance, validated_data):
        # Extract Data
        user = validated_data.pop('user', None)
        address = validated_data.pop('address', True)
        # Update User
        if user: 
            [setattr(instance.user, k, v)for k, v in user.items()]
            instance.user.save()      
        #Update Address
        if isinstance(address, dict):
            if not instance.address: instance.address = Address.objects.create(**address)
            else: 
                [setattr(instance.address, k, v) for k, v in address.items()]
                instance.address.save()
        elif address == None: instance.address = None
        # Update Client
        [setattr(instance, k, v) for k, v in validated_data.items()]
        instance.save()
        return instance

    def create(self, validated_data):
        """
        Create and return a new `Inspector` instance, given the validated data.
        """
        # Create User
        user_data = validated_data.pop('user', None)
        user = User(is_client=False, is_inspector=True, is_staff=False, **user_data)
        password = user.gen_password()
        user.set_password(password)
        user.save()
        # Create Address
        address_data = validated_data.pop('address', None)
        address = Address.objects.create(**address_data) if address_data else None
        # Create the Client
        inspector = Inspector(user=user, address=address, **validated_data)
        inspector.save()
        return inspector

        def gen_password(self):
            # Random string with the combination of lower and upper case
            letters = string.ascii_letters
            password = ''.join(random.choice(letters) for i in range(10))
            return password

class ClientSerializer(ModelSerializer):
    '''
        Serialize the data of client.
    '''
    user = UserSerializer()
    address = AddressSerializer(allow_null=True)

    class Meta:
        model = Client
        fields = "__all__"

    def update(self, instance, validated_data):
        # Extract Data
        user = validated_data.pop('user', None)
        address = validated_data.pop('address', True)
        # Update User
        if user: 
            [setattr(instance.user, k, v)for k, v in user.items()]
            instance.user.save()      
        #Update Address
        if isinstance(address, dict):
            if not instance.address: instance.address = Address.objects.create(**address)
            else: 
                [setattr(instance.address, k, v) for k, v in address.items()]
                instance.address.save()
        if address == None: instance.address = None
        # Update Client
        [setattr(instance, k, v) for k, v in validated_data.items()]
        instance.save()
        return instance

    def create(self, validated_data):
        """
        Create and return a new `OrderItem` instance, given the validated data.
        """
        # Create User or Reactivate
        user_data = validated_data.pop('user', None)
        user = User(is_client=True, is_inspector=False, is_staff=False, **user_data)
        password = user.gen_password()
        user.set_password(password)
        user.save()
        # Create Address
        address_data = validated_data.pop('address', None)
        address = Address.objects.create(**address_data) if address_data else None
        # Create or Reactive the Client
        client = Client(user=user, address=address, **validated_data)
        client.save()
        return client


