from django.urls import re_path
from . import consumers


websocket_urlpatterns = [
    re_path(r'ws/socket-server', consumers.ChatConsumer.as_asgi()),
    # re_path(r'^/sync/(?P<group_name>[a-zA-Z0-9_]+)/$', consumers.GroupConsumer.as_asgi())
]