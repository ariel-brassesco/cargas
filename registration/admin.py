from django.contrib import admin
from django.contrib.auth.admin import UserAdmin as BaseUserAdmin
from .models import User, Client, Inspector, Address

# Register your models here
# Define a new User admin
class UserAdmin(BaseUserAdmin):
    list_display = [
        'id',
        'username',
        'email',
        'first_name',
        'last_name',
        'is_active',
        'is_staff',
        'is_inspector',
        'is_client'
        ]
    # In fieldset define the custom fields 
    # when change an user in admin app
    fieldsets = BaseUserAdmin.fieldsets + (
        (None, {'fields': ('is_client', 'is_inspector')}),
    )
    # In add_fieldset define the custom fields 
    # when create anew user in admin app
    add_fieldsets = BaseUserAdmin.add_fieldsets + (
        (None, {'fields': ('is_client', 'is_inspector')}),
    )

class AddressAdmin(admin.ModelAdmin):
    list_display = ['id', 'address', 'lat', 'lon']

class ClientAdmin(admin.ModelAdmin):
    list_display = [ 'pk', 'company', 'phone', 'address']

class InspectorAdmin(admin.ModelAdmin):
    list_display = [ 'pk', 'phone', 'address']

# Re-register UserAdmin
#admin.site.unregister(User)
admin.site.register(User, UserAdmin)
admin.site.register(Client, ClientAdmin)
admin.site.register(Inspector, InspectorAdmin)
admin.site.register(Address, AddressAdmin)
