from lib2to3.pgen2 import token
from django.contrib.auth.models import AnonymousUser
from rest_framework.authtoken.models import Token
from channels.db import database_sync_to_async
from channels.middleware import BaseMiddleware
from urllib.parse import parse_qs
from django.db import close_old_connections
from django.contrib.auth import get_user_model

User = get_user_model()

@database_sync_to_async
def get_user(token_key):
    try:
        token = Token.objects.get(key=token_key)
        return token.user
    except Token.DoesNotExist:
        return AnonymousUser()



class QueryAuthMiddleware:
    def __init__(self, inner):
        # Store the ASGI application we were passed
        self.inner = inner

    def __call__(self, scope):
        # Look up user from query string (you should also do things like
        # check it's a valid user ID, or if scope["user"] is already populated)

        query_string = parse_qs(scope['query_string'])
        if b'user_id' in query_string:
            user = User.objects.get(id=int(query_string[b'user_id'][0]))
            print("middleware user", user)
            close_old_connections()
        else:
            user = AnonymousUser
        # Return the inner application directly and let it run everything else
        return self.inner(dict(scope, user=user))

# class TokenAuthMiddleware(BaseMiddleware):
#     def __init__(self, inner):
#         super().__init__(inner)

#     async def __call__(self, scope, receive, send):
#         try:
#             token_key = (dict((x.split('=') for x in scope['query_string'].decode().split("&")))).get('token', None)
           
#         except ValueError:
#             token_key = None
#         scope['user'] = AnonymousUser() if token_key is None else await get_user(token_key)
#         return await super().__call__(scope, receive, send)