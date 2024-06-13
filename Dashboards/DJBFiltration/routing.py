from django.urls import re_path, path

from . import consumers

websocket_urlpatterns = [
    re_path(r"ws/socketdjb/(?P<user_name>\w+)/$", consumers.DashboardConsumer.as_asgi()),
]