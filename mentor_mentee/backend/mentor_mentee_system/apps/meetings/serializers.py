from rest_framework import serializers
from .models import Meeting
from ..users.serializers import UserSerializer

class MeetingSerializer(serializers.ModelSerializer):
    mentor_details = UserSerializer(source='mentor', read_only=True)
    mentee_details = UserSerializer(source='mentee', read_only=True)

    class Meta:
        model = Meeting
        fields = ['id', 'mentor', 'mentee', 'mentor_details', 'mentee_details', 
                 'title', 'description', 'scheduled_at', 'duration', 'status', 
                 'notes', 'created_at', 'updated_at']
        read_only_fields = ['id', 'created_at', 'updated_at'] 