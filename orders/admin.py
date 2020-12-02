from django.contrib import admin

from .models import (
    Order,
    ContainerOrder,
    CloseOrder,
    RowOrder,
    WeightControl,
    TemperatureControl,
    OrganolepticControl,
    ImageControl
)
# Register your models here.


class OrderAdmin(admin.ModelAdmin):
    list_display = ('id', 'client', 'inspector')
    filter_horizontal = ('products',)


class ContainerAdmin(admin.ModelAdmin):
    list_display = ("id", "order", "empty", "matricula",
                    "ventilation", "uploaded_at")


class CloseOrderAdmin(admin.ModelAdmin):
    list_display = ("id", "order", "full", "semi_close",
                    "close", "precinto", "uploaded_at")


class RowAdmin(admin.ModelAdmin):
    list_display = ("id", "order", "number", "product",
                    "size", "image", "quantity")


class TempAdmin(admin.ModelAdmin):
    list_display = ("id", "order", "row", "temp")


class WeightAdmin(admin.ModelAdmin):
    list_display = ("id", "order", "package", "carton",
                    "primary_package", "product")


class OrganolepticAdmin(admin.ModelAdmin):
    list_display = ("id", "order", "comment")


class ImageAdmin(admin.ModelAdmin):
    list_display = ("id", "order", "control", "number", "image", "uploaded_at")


admin.site.register(Order, OrderAdmin)
admin.site.register(ContainerOrder, ContainerAdmin)
admin.site.register(CloseOrder, CloseOrderAdmin)
admin.site.register(RowOrder, RowAdmin)
admin.site.register(TemperatureControl, TempAdmin)
admin.site.register(WeightControl, WeightAdmin)
admin.site.register(OrganolepticControl, OrganolepticAdmin)
admin.site.register(ImageControl, ImageAdmin)
