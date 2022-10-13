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
