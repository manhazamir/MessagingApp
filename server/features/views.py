from rest_framework import generics, status
from rest_framework.response import Response
from django.contrib.auth import authenticate
from rest_framework.authtoken.models import Token

from features.serializers import CustomRegistrationSerializer
from features.models import User


class CustomRegistration(generics.GenericAPIView):
    serializer_class = CustomRegistrationSerializer

    def post(self, request, *args, **kwargs):
        serializer = self.get_serializer(data = request.data)
        
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data,  status= status.HTTP_200_OK)
        else:
            print("Error", serializer.errors)
            return Response(serializer.errors, status= status.HTTP_400_BAD_REQUEST)

    def get(self, request):
        print(request.data)
        users = User.objects.all()
        serializer = CustomRegistrationSerializer(users, many = True)
        return Response(serializer.data)

    def put(self, request, pk):
        user_obj = User.objects.get(pk = pk)
        serializer = CustomRegistrationSerializer(user_obj, data=request.data) 
        if serializer.is_valid():
            serializer.save()
            print("Serailizer data", serializer.data)
            return Response(serializer.data,  status= status.HTTP_200_OK)
        print("Error", serializer.errors)
        return Response(serializer.errors, status= status.HTTP_400_BAD_REQUEST)


class CustomLogin(generics.GenericAPIView):

    def post(self, request, *args, **kwargs):

        username = request.data['username']
        password = request.data['password']
        user = authenticate(username=username, password=password)
        print("Ayo", user)
        if not user:
            return Response({"result": {"token": None}}, status= status.HTTP_400_BAD_REQUEST)

        token, _ = Token.objects.get_or_create(user=user)
        return Response({"result": {'token': token.key, 'username': user.username,
                            "id": user.id,
                            'created': token.created,
                            'is_admin': user.is_staff
        } })
        
