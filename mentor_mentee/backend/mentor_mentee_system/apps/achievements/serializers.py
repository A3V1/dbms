from rest_framework import serializers
from mentor_mentee_system.models import Achievement, UserAchievement

class AchievementSerializer(serializers.ModelSerializer):
    class Meta:
        model = Achievement
        fields = ['id', 'name', 'description', 'created_at', 'badge_icon', 'mentor', 'mentee']
        read_only_fields = ['id', 'created_at']

class UserAchievementSerializer(serializers.ModelSerializer):
    achievement_details = AchievementSerializer(source='achievement', read_only=True)

    class Meta:
        model = UserAchievement
        fields = ['id', 'user', 'achievement', 'achievement_details', 'awarded_at', 'awarded_by']
        read_only_fields = ['id', 'awarded_at'] 