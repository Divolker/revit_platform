from django.shortcuts import render
from rest_framework import viewsets, permissions, status
from rest_framework.decorators import action
from rest_framework.response import Response
from django.contrib.auth import get_user_model
from .models import User
from .serializers import UserSerializer

# Create your views here.

class UserViewSet(viewsets.ModelViewSet):
    queryset = User.objects.all()
    serializer_class = UserSerializer
    
    @action(detail=False, methods=['get'])
    def me(self, request):
        """Получить данные текущего пользователя"""
        serializer = self.get_serializer(request.user)
        return Response(serializer.data)
    
    @action(detail=False, methods=['get'])
    def contractors(self, request):
        """Получить список исполнителей"""
        contractors = User.objects.filter(role='CONTRACTOR')
        serializer = self.get_serializer(contractors, many=True)
        return Response(serializer.data)
    
    @action(detail=False, methods=['get'])
    def clients(self, request):
        """Получить список заказчиков"""
        clients = User.objects.filter(role='CLIENT')
        serializer = self.get_serializer(clients, many=True)
        return Response(serializer.data)
