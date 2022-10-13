import json
from re import L
from channels.db import database_sync_to_async
from channels.generic.websocket import WebsocketConsumer
from django.contrib.auth.models import AnonymousUser
from asgiref.sync import async_to_sync
from django.contrib.auth import get_user_model
# from features.models import Thread, ChatMessage
from urllib.parse import urlparse, parse_qs 

User = get_user_model()

class ChatConsumer(WebsocketConsumer):
    def connect(self):
        # self.room_name = self.scope['url_route']['kwargs']['room_name']
        # self.room_group_name = f'chat_{self.room_name}'
        # self.room = Room.objects.get(name=self.room_name)
        params = parse_qs(self.scope['query_string'].decode('utf8'))
        user_id = params.get('user_id', (None,))[0]

        self.user = user_id
        print("user", self.user)
        chat_room = f'user_chatroom_{self.user}'
        self.chat_room = chat_room

        self.channel_layer.group_add(
            chat_room,
            self.channel_name

        )

        self.accept()
        self.send(text_data=json.dumps({'type': 'connection_established', 'message': 'You are now connected'}))
      

        
    def receive(self, text_data):
        print(text_data)
        text_data_json = json.loads(text_data)
        message = text_data_json['message']
        sent_from_id = text_data_json['sent_from']
        sent_to_id = text_data_json['sent_to']
        
 
        print('Message', message)

        sent_from_user = self.get_user_object(sent_from_id)
        sent_to_user = self.get_user_object(sent_to_id)
        if not sent_from_user: 
            print("Incorrect sent from id")
        if not sent_to_user:
            print("Incorrect sent to id")

        other_user_chat_room = f'user_chatroom_{sent_to_id}'
        self_user = self.scope['user']

        response = {
            'message': message,
            'sent_by': self_user.id
        }

        self.channel_layer.group_send(
            other_user_chat_room,
            {
                "type": 'chat_message',
                'text': json.dumps(response)
            }
        )
        self.channel_layer.group_send(
            self.chat_room,
            {
                "type": 'chat_message',
                'text': json.dumps(response)
            }
        )

        

        # self.send(text_data=json.dumps({'type': 'chat', 'message': message, 'sent_from': sent_from_id, "sent_to": sent_to_id}))

    @database_sync_to_async
    def get_user(user_id):
        try:
            return User.objects.get(id=user_id)
        except User.DoesNotExist:
            return AnonymousUser()


    @database_sync_to_async
    def get_user_object(self, user_id):
        qs = User.objects.get(id=user_id)
        if qs.exists():
            obj = qs

        else:
            obj =None
        return obj

    # @database_sync_to_async
    # def get_thread(self, thread_id):
    #     qs = Thread.objects.filter(id=thread_id)
    #     if qs.exists():
    #         obj = qs.first()
    #     else:
    #         obj = None
    #     return obj

    # @database_sync_to_async
    # def create_chat_message(self, thread, user, msg):
    #     ChatMessage.objects.create(thread=thread, user=user, message=msg)
 
    # def chat_message(self, event):
    #     message = event['message']
    #     userID = event['userID']
        
    #     self.send(text_data=json.dumps({
    #         'type': 'chat',
    #         'message': message,
    #         'userID': userID, 
    #     }))

# class ChatConsumer(WebsocketConsumer):
#     def connect(self): 

#         self.room_group_name = 'test'

#         async_to_sync(self.channel_layer.group_add)(
#            self.room_group_name,  # try self.group_name
#            self.channel_name
#         )

#         self.accept()
        
#     def receive(self, text_data):
#         text_data_json = json.loads(text_data)
#         message = text_data_json['message']
#         userID = text_data_json['sent_from']

#         print(userID)

#         async_to_sync(self.channel_layer.group_send)(
#             self.room_group_name,
#             {
#                 'type': 'chat_message',
#                 'message': message,
#                 'userID': userID,

#             }
#         )

#     def chat_message(self, event):
#         message = event['message']
#         userID = event['userID']
        
#         self.send(text_data=json.dumps({
#             'type': 'chat',
#             'message': message,
#             'userID': userID,
#         }))


class GroupConsumer(WebsocketConsumer):
    def connect(self, group_name): 

        async_to_sync(self.channel_layer.group_add)(
           group_name,  # try self.group_name
           self.channel_name
        )

        self.accept()

    def receive(self, text_data, group_name):
        text_data_json = json.loads(text_data)
        message = text_data_json['message']

        async_to_sync(self.channel_layer.group_send)(
            group_name,
            {
                'type': 'chat_message',
                'message': message,
            }
        )

    def chat_message(self, event):
        message = event['message']
        
        self.send(text_data=json.dumps({
            'type': 'chat',
            'message': message,
        }))
        
