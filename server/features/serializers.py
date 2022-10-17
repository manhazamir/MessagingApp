from re import search
from rest_framework import serializers
from rest_framework.authtoken.models import Token

from features.models import User, Thread, NewGroup


class CustomRegistrationSerializer(serializers.ModelSerializer):
    token = serializers.CharField(read_only = True)

    class Meta:
        model = User
        fields = ['id','fname', 'lname','username', 'password', 'token']

        extra_kwargs = {"password": {"write_only": True},
                        "is_staff": {"write_only": True}}
        
    def create(self, validated_data):
        password = validated_data.pop('password')
        fname = validated_data.pop('fname')
        lname = validated_data.pop('lname')
        user_obj = User(**validated_data)
        user_obj.fname = fname
        user_obj.lname = lname
        user_obj.set_password(password)
        user_obj.save()
        token, _ = Token.objects.get_or_create(user=user_obj)
        user_obj.token = token.key
        return user_obj

# class GroupUsersSerializer(serializers.ModelSerializer):
#     class Meta:
#         model = User
#         fields = ['id', 'fname', 'lname', 'username']

class NewGroupSerializer(serializers.ModelSerializer):
    users = serializers.SlugRelatedField(many=True, slug_field="id", queryset=User.objects.all())
    class Meta:
        model = NewGroup
        fields = ['id', 'group_name', 'users', 'user_fk']


class ThreadSerializer(serializers.ModelSerializer):

    class Meta:
        model = Thread
        fields = '__all__'
