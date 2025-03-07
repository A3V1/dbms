from rest_framework import serializers
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from django.contrib.auth import get_user_model
from .models import User, Mentor, Mentee, Admin

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ('id', 'username', 'email', 'first_name', 'last_name', 'role', 
                 'official_mail_id', 'phone_number', 'prn_id_no', 'profile_picture')
        read_only_fields = ('id',)

class CustomTokenObtainPairSerializer(TokenObtainPairSerializer):
    def validate(self, attrs):
        data = super().validate(attrs)
        # Rename 'access' to 'token' for frontend compatibility
        data['token'] = data.pop('access')
        
        user = self.user
        # Add user data to response
        data['user'] = {
            'id': user.id,
            'email': user.email,
            'role': user.role,
            'first_name': user.first_name,
            'last_name': user.last_name,
        }
        return data

class LoginSerializer(serializers.Serializer):
    email = serializers.EmailField()
    password = serializers.CharField(write_only=True)

class RegisterSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True)
    confirm_password = serializers.CharField(write_only=True)

    class Meta:
        model = User
        fields = ('username', 'email', 'password', 'confirm_password', 'first_name', 
                 'last_name', 'role', 'official_mail_id', 'phone_number', 'prn_id_no')

    def validate(self, data):
        if data['password'] != data['confirm_password']:
            raise serializers.ValidationError("Passwords don't match")
        return data

    def create(self, validated_data):
        validated_data.pop('confirm_password')
        user = User.objects.create_user(**validated_data)
        
        # Create role-specific profile
        if validated_data['role'] == 'mentor':
            Mentor.objects.create(user=user)
        elif validated_data['role'] == 'mentee':
            Mentee.objects.create(user=user)
        elif validated_data['role'] == 'admin':
            Admin.objects.create(user=user)
        
        return user

class MentorProfileSerializer(serializers.ModelSerializer):
    user = UserSerializer()
    
    class Meta:
        model = Mentor
        fields = ('id', 'user', 'room_no', 'timetable', 'department', 
                 'academic_background', 'post_in_hand')

class MenteeProfileSerializer(serializers.ModelSerializer):
    user = UserSerializer()
    mentor = MentorProfileSerializer(read_only=True)
    
    class Meta:
        model = Mentee
        fields = ('id', 'user', 'mentor', 'course', 'year', 'attendance', 
                 'academic', 'upcoming_event', 'alternate_contact')

class AdminProfileSerializer(serializers.ModelSerializer):
    user = UserSerializer()
    
    class Meta:
        model = Admin
        fields = ('id', 'user', 'privileges') 