import json
from re import L
from channels.db import database_sync_to_async
from channels.consumer import AsyncConsumer
from channels.generic.websocket import WebsocketConsumer
from django.contrib.auth.models import AnonymousUser
from asgiref.sync import async_to_sync
from django.contrib.auth import get_user_model
# from features.models import Thread, ChatMessage
from urllib.parse import urlparse, parse_qs 

User = get_user_model()

class ChatConsumer(AsyncConsumer):
    # async def websocket_connect(self, event):
    #     # self.room_name = self.scope['url_route']['kwargs']['room_name']
    #     # self.room_group_name = f'chat_{self.room_name}'
    #     # self.room = Room.objects.get(name=self.room_name)
    #     params = parse_qs(self.scope['query_string'].decode('utf8'))
    #     user_id = params.get('user_id', (None,))[0]

    #     self.user = user_id
    #     print("user", self.user)
    #     chat_room = f'user_chatroom_{self.user}'
    #     self.chat_room = chat_room

    #     self.channel_layer.group_add(
    #         chat_room,
    #         self.channel_name

    #     )
      
        
    # async def websocket_receive(self, event):
    #     text_data = event['text']
    #     print(text_data)
    #     text_data_json = json.loads(text_data)
    #     message = text_data_json['message']
    #     sent_from_id = text_data_json['sent_from']
    #     sent_to_id = text_data_json['sent_to']
        
 
    #     print('Message', message)

    #     sent_from_user = await self.get_user_object(sent_from_id)
      
    #     sent_to_user = await self.get_user_object(sent_to_id)
    #     print(sent_to_user)
    #     if not sent_from_user: 
    #         print("Incorrect sent from id")
    #     if not sent_to_user:
    #         print("Incorrect sent to id")
    #     print("s2",sent_from_user)
    #     print("sF",sent_to_user)

    #     other_user_chat_room = f'user_chatroom_{sent_to_id}'
    #     params = parse_qs(self.scope['query_string'].decode('utf8'))
    #     user_id = params.get('user_id', (None,))[0]

    #     self_user = user_id

    #     response = {
    #         'message': message,
    #         'sent_by': self_user
    #     }

    #     # one copy of msg goes to the other user 

    #     await self.channel_layer.group_send(
    #         other_user_chat_room,
    #         {
    #             "type": 'chat_message',
    #             'text': json.dumps(response)
    #         }
    #     )

    #     # one copy of msg goes to the user who sent
    #     await self.channel_layer.group_send(
    #         self.chat_room,
    #         {
    #             "type": 'chat_message',
    #             'text': json.dumps(response)
    #         }
    #     )


    # async def chat_message(self, event):
    #     print('chat_message', event)

    #     await self.send({
    #         'type': 'websocket.send', 
    #         'text': event['text']
    #     })

    # @database_sync_to_async
    # def get_user_object(self, user_id):
    #     qs = User.objects.filter(id=user_id)
    #     if qs.exists():
    #         obj = qs.first()

    #     else:
    #         obj =None
    #     return obj


    async def websocket_connect(self, event):
        print('connected', event)
        params = parse_qs(self.scope['query_string'].decode('utf8'))
        user = params.get('user_id', (None,))[0]
        chat_room = f'user_chatroom_{user}'
        self.chat_room = chat_room
        await self.channel_layer.group_add(
            chat_room,
            self.channel_name
        )
        await self.send({
            'type': 'websocket.accept'
        })

    async def websocket_receive(self, event):
        print('receive', event)
        received_data = json.loads(event['text'])
        msg = received_data.get('message')
        sent_by_id = received_data.get('sent_by')
        send_to_id = received_data.get('send_to')
        # thread_id = received_data.get('thread_id')

        print("sentbyid", sent_by_id)
        print("Senttoid", send_to_id)

        if not msg:
            print('Error:: empty message')
            return False

        sent_by_user = await self.get_user_object(sent_by_id)
        send_to_user = await self.get_user_object(send_to_id)

        print("ok",sent_by_user)
        # thread_obj = await self.get_thread(thread_id)
        if not sent_by_user:
            print('Error:: sent by user is incorrect')
        if not send_to_user:
            print('Error:: send to user is incorrect')
        # if not thread_obj:
        #     print('Error:: Thread id is incorrect')

        # await self.create_chat_message(thread_obj, sent_by_user, msg)

        other_user_chat_room = f'user_chatroom_{send_to_id}'
        print("ousr", other_user_chat_room)
        print("self chatroom", self.chat_room)
        params = parse_qs(self.scope['query_string'].decode('utf8'))
        self_user = params.get('user_id', (None,))[0]
       
        response = {
            'message': msg,
            'sent_by': self_user,
            # 'thread_id': thread_id
        }

        await self.channel_layer.group_send(
            other_user_chat_room,
            {
                'type': 'chat_message',
                'text': json.dumps(response)
            }
        )

        await self.channel_layer.group_send(
            self.chat_room,
            {
                'type': 'chat_message',
                'text': json.dumps(response)
            }
        )



    async def websocket_disconnect(self, event):
        print('disconnect', event)

    async def chat_message(self, event):
        print('chat_message', event)
        await self.send({
            'type': 'websocket.send',
            'text': event['text']
        })

    @database_sync_to_async
    def get_user_object(self, user_id):
        qs = User.objects.filter(id=user_id)
        if qs.exists():
            obj = qs.first()
        else:
            obj = None
        return obj

# below comments are loser
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
        
