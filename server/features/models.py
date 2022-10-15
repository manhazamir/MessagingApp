from sqlite3 import Timestamp
from django.db import models
from django.contrib.auth.models import AbstractUser
from django.contrib.auth.models import UserManager

class User(AbstractUser):
    REQUIRED_FIELDS = ['password']
    USERNAME_FIELD = 'username'
    is_anonymous = False
    is_authenticated = True
    is_active = True

    fname = models.CharField(max_length=255, blank= False)
    lname = models.CharField(max_length=255, blank= False)
    username = models.CharField(max_length=30, blank= False, unique=True)
    password = models.CharField(max_length=255, blank= False)
    
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    objects = UserManager()


class Thread(models.Model):
    user1 = models.ForeignKey(User, on_delete = models.CASCADE, null = True, blank = True, related_name = 'thread_user1')
    user2 = models.ForeignKey(User, on_delete = models.CASCADE, null = True, blank = True, related_name = 'thread_user2')
    updated = models.DateTimeField(auto_now =True)
    timestamp = models.DateTimeField(auto_now_add = True)

    class Meta:
        unique_together = ['user1', 'user2']

class ChatMessage(models.Model):
    thread = models.ForeignKey(Thread, on_delete = models.CASCADE, null = True, blank = True, related_name = 'chatmessage_thread')
    user = models.ForeignKey(User, on_delete = models.CASCADE)
    message = models.TextField()
    timestamp = models.DateTimeField(auto_now_add = True)
