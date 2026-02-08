from rest_framework import serializers
from django.contrib.auth import authenticate
from rest_framework_simplejwt.tokens import RefreshToken
from .models import Profile,TodoList

from django.contrib.auth import get_user_model

User = get_user_model() 

class RegisterSerializer(serializers.Serializer):
    email = serializers.EmailField()
    password = serializers.CharField()
    name = serializers.CharField()

    def create(self, validated_data):
        User = get_user_model()  
        user = User.objects.create_user(
            email=validated_data['email'],
            password=validated_data['password'],
            name=validated_data['name']
        )

        from .models import Profile
        Profile.objects.create(user=user)

        return user




class LoginSerializer(serializers.Serializer):
    email = serializers.EmailField()
    password = serializers.CharField()

    def validate(self, data):
        user = authenticate(
            email=data['email'],
            password=data['password']
        )

        if not user:
            raise serializers.ValidationError("Invalid credentials")

        refresh = RefreshToken.for_user(user)

        return {
            'refresh': str(refresh),
            'access': str(refresh.access_token),
        }


class ProfileSerializer(serializers.ModelSerializer):
    class Meta:
        model = Profile
        fields = '__all__'


class TodolistSerializer(serializers.ModelSerializer):
    class Meta:
        model=TodoList
        fields= ['id', 'activity', 'dateTime', 'done']