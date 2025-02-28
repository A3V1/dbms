from django.shortcuts import render
from rest_framework import status, viewsets
from rest_framework.decorators import action
from rest_framework.permissions import AllowAny
from rest_framework.response import Response
from rest_framework_simplejwt.tokens import RefreshToken
from django.contrib.auth import authenticate
from django.db import transaction
from .serializers import UserSerializer, LoginSerializer, RegisterSerializer
from .models import User

# Create your views here.

class AuthViewSet(viewsets.ViewSet):
    permission_classes = [AllowAny]

    @action(detail=False, methods=['post'])
    def login(self, request):
        serializer = LoginSerializer(data=request.data)
        if serializer.is_valid():
            email = serializer.validated_data['email']
            password = serializer.validated_data['password']
            user = authenticate(request, username=email, password=password)
            
            if user:
                refresh = RefreshToken.for_user(user)
                # Add custom claims
                token_data = {
                    'role': user.role,
                    'email': user.email,
                    'user_id': user.id
                }
                
                # Add claims to both refresh and access tokens
                for key, value in token_data.items():
                    refresh[key] = value
                    refresh.access_token[key] = value
                
                # Get user data
                user_data = UserSerializer(user).data
                
                print("Debug - Token payload:", token_data)  # Debug print
                print("Debug - Access token:", str(refresh.access_token))  # Debug print
                
                return Response({
                    'token': str(refresh.access_token),
                    'user': user_data
                })
            return Response(
                {'error': 'Invalid email or password'},
                status=status.HTTP_401_UNAUTHORIZED
            )
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    @action(detail=False, methods=['post'])
    def register(self, request):
        """Register endpoint"""
        serializer = RegisterSerializer(data=request.data)
        if serializer.is_valid():
            try:
                with transaction.atomic():
                    user = serializer.save()
                    return Response(
                        UserSerializer(user).data,
                        status=status.HTTP_201_CREATED
                    )
            except Exception as e:
                return Response(
                    {'error': str(e)},
                    status=status.HTTP_400_BAD_REQUEST
                )
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    @action(detail=False, methods=['get'])
    def me(self, request):
        """Get current user info"""
        serializer = UserSerializer(request.user)
        return Response(serializer.data)
