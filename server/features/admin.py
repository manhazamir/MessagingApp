from django.contrib import admin
from .models import User, Thread, ChatMessage
from django import forms
from django.db.models import Q
from django.core.exceptions import ValidationError

# Register your models here.
admin.site.register(User)
admin.site.register(ChatMessage)

class ChatMessage(admin.TabularInline):
    model = ChatMessage



class ThreadAdmin(admin.ModelAdmin):
    inlines = [ChatMessage]
    class Meta:
        model = Thread


admin.site.register(Thread, ThreadAdmin)
