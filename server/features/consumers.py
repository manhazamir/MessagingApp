import json
from channels.db import database_sync_to_async
from channels.consumer import AsyncConsumer
from channels.generic.websocket import WebsocketConsumer
from django.contrib.auth.models import AnonymousUser
from asgiref.sync import async_to_sync
from django.contrib.auth import get_user_model
from features.models import User
from urllib.parse import urlparse, parse_qs 
from features.models import Thread, User, ChatMessage
from django.db.models import Q


User = get_user_model()

class ChatConsumer(AsyncConsumer):
    async def websocket_connect(self, event):
        print('connected', event)
       
        params = parse_qs(self.scope['query_string'].decode('utf8'))
        user = params.get('logged_user', (None,))[0]

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
        thread_id = received_data.get('thread_id')

        if not msg:
            print('Error:: empty message')
            return False

        sent_by_user = await self.get_user_object(sent_by_id)
        print("sent by user", sent_by_user)
   

        send_to_user = await self.get_user_object(send_to_id)
        print("sent to user", send_to_user)

        thread_obj = await self.get_thread(thread_id)
        if not sent_by_user:
            print('Error:: sent by user is incorrect')
        if not send_to_user:
            print('Error:: send to user is incorrect')
        if not thread_obj:
            print('Error:: Thread id is incorrect')

        await self.create_chat_message(thread_obj, sent_by_user, msg)

        other_user_chat_room = f'user_chatroom_{send_to_id}'
       
        response = {
            'message': msg,
            'sent_by': sent_by_id,
            'sent_to': send_to_id,
            'thread_id': thread_id
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

    @database_sync_to_async
    def get_thread(self, thread_id):
        qs = Thread.objects.filter(id=thread_id)
        if qs.exists():
            obj = qs.first()
        else:
            obj = None
        return obj

    @database_sync_to_async
    def create_chat_message(self, thread, user, msg):
        ChatMessage.objects.create(thread=thread, user=user, message=msg)


class BroadcastConsumer(WebsocketConsumer):

    def connect(self): 

        self.room_name = 'broadcast'
        async_to_sync(self.channel_layer.group_add)(
           self.room_name,
           self.channel_name    # to add in the group (unique)
        )

        print(f'[{self.channel_name}] - You are connected')

        self.accept()
        self.send(text_data=json.dumps({
            'message': "Connected"
        }))



    def receive(self, text_data):
        text_data_json = json.loads(text_data)
        message = text_data_json["message"]
        print(text_data_json)
        sent_by = text_data_json['sent_by']
        print(f'[{self.channel_name}] - Received message - {message}')

        async_to_sync(self.channel_layer.group_send)(
            self.room_name,
            {
                'type': 'broadcast.message', # event below is called (replaces . with _)
                'sent_by': sent_by,
                'message': message,
            }
        )


    def broadcast_message(self, event): # creating custom event, called the # of channels times
       
        print("event",event)
        message = event['message']
        sent_by_id = event['sent_by']
        sent_user = User.objects.get(id = sent_by_id)
        print(f'[{self.channel_name}] - Message sent to event - {message}')

        lookup = Q(user1=sent_user) | Q(user2=sent_user)
        print("broadcast lookup", lookup)
        if (lookup): 
            self.send(text_data=json.dumps({
                'type': 'broadcast',
                'message': message,
                'sent_by_username': sent_user.username,
                'sent_by_id': sent_user.id,
            }))

        
    # def disconnect(self, code): 
    #     print(f'[{self.channel_name}] - Channel disconnected')

    #     async_to_sync(self.channel_layer.group_discard)(
    #        self.room_name,
    #        self.channel_name  
    #     ) 
    

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
        
