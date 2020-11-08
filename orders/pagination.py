from collections import OrderedDict
from rest_framework.response import Response
from rest_framework.pagination import PageNumberPagination

class OrdersPagination(PageNumberPagination):
    page_size = 2

    def get_next_page(self):
        if not self.page.has_next():
            return None
        return self.page.next_page_number()
    
    def get_previous_page(self):
        if not self.page.has_previous():
            return None
        return self.page.previous_page_number()


    def get_paginated_response(self, data):
        return Response(OrderedDict([
            ("count", self.page.paginator.count),
            ("current", self.page.number),
            ("next", self.get_next_page()),
            ("previous", self.get_previous_page()),
            ("total_pages", self.page.paginator.num_pages),
            ("results", data)
        ]))
