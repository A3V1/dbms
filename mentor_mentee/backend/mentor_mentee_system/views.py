from rest_framework import status, viewsets, generics
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework_simplejwt.tokens import RefreshToken
from django.contrib.auth import authenticate
from .models import User, Mentor, Mentee, Admin, Meeting, Message, Achievement
from .serializers import (
    UserSerializer, LoginSerializer, RegisterSerializer,
    MentorProfileSerializer, MenteeProfileSerializer, AdminProfileSerializer
)

class RegisterView(generics.CreateAPIView):
    queryset = User.objects.all()
    permission_classes = (AllowAny,)
    serializer_class = RegisterSerializer

class LoginView(generics.GenericAPIView):
    serializer_class = LoginSerializer
    permission_classes = (AllowAny,)

    def post(self, request):
        email = request.data.get('email')
        password = request.data.get('password')
        
        # For testing, accept any credentials
        try:
            # Try to get the user by email
            user = User.objects.get(email=email)
            
            # Generate tokens
            refresh = RefreshToken.for_user(user)
            
            # Get role-specific profile
            profile_data = None
            if user.role == 'mentor':
                profile = Mentor.objects.get(user=user)
                profile_data = MentorProfileSerializer(profile).data
            elif user.role == 'mentee':
                profile = Mentee.objects.get(user=user)
                profile_data = MenteeProfileSerializer(profile).data
            elif user.role == 'admin':
                profile = Admin.objects.get(user=user)
                profile_data = AdminProfileSerializer(profile).data

            return Response({
                'token': str(refresh.access_token),
                'refresh': str(refresh),
                'user': UserSerializer(user).data,
                'profile': profile_data
            })
        except User.DoesNotExist:
            # If user doesn't exist, create one
            user = User.objects.create(
                email=email,
                username=email.split('@')[0],
                password=password,  # Store password as plain text for testing
                role='admin'  # Default to admin for testing
            )
            
            # Create admin profile
            Admin.objects.create(user=user)
            
            # Generate tokens
            refresh = RefreshToken.for_user(user)
            
            return Response({
                'token': str(refresh.access_token),
                'refresh': str(refresh),
                'user': UserSerializer(user).data,
                'profile': AdminProfileSerializer(Admin.objects.get(user=user)).data
            })

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def logout(request):
    try:
        refresh_token = request.data['refresh']
        token = RefreshToken(refresh_token)
        token.blacklist()
        return Response({'detail': 'Successfully logged out'})
    except Exception:
        return Response(
            {'detail': 'Invalid token'}, 
            status=status.HTTP_400_BAD_REQUEST
        )

class UserViewSet(viewsets.ModelViewSet):
    permission_classes = [IsAuthenticated]
    serializer_class = UserSerializer
    
    def get_queryset(self):
        user = self.request.user
        if user.role == 'admin':
            return User.objects.all()
        elif user.role == 'mentor':
            return User.objects.filter(mentee__mentor__user=user)
        else:
            return User.objects.filter(id=user.id)

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_user_profile(request):
    user = request.user
    if user.role == 'mentor':
        profile = Mentor.objects.get(user=user)
        serializer = MentorProfileSerializer(profile)
    elif user.role == 'mentee':
        profile = Mentee.objects.get(user=user)
        serializer = MenteeProfileSerializer(profile)
    else:
        profile = Admin.objects.get(user=user)
        serializer = AdminProfileSerializer(profile)
    
    return Response(serializer.data)

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_mentor_dashboard(request):
    """Get all dashboard data for a mentor"""
    if request.user.role != 'mentor':
        return Response(
            {'detail': 'Only mentors can access this endpoint'},
            status=status.HTTP_403_FORBIDDEN
        )
    
    try:
        mentor = Mentor.objects.get(user=request.user)
        mentees = Mentee.objects.filter(mentor=mentor).select_related('user')
        
        # Get upcoming meetings
        upcoming_meetings = Meeting.objects.filter(
            mentor=request.user,
            status='pending'
        ).order_by('scheduled_at')[:5]
        
        # Get unread messages count
        unread_messages = Message.objects.filter(
            receiver=request.user,
            is_read=False
        ).count()
        
        # Get recent achievements
        recent_achievements = Achievement.objects.filter(
            mentor=mentor
        ).order_by('-date_awarded')[:5]
        
        # Prepare mentee data
        mentee_data = []
        for mentee in mentees:
            mentee_info = {
                'id': mentee.id,
                'user': {
                    'id': mentee.user.id,
                    'name': f"{mentee.user.first_name} {mentee.user.last_name}",
                    'email': mentee.user.email,
                    'profile_picture': mentee.user.profile_picture
                },
                'course': mentee.course,
                'year': mentee.year,
                'attendance': mentee.attendance,
                'academic': mentee.academic,
                'upcoming_event': mentee.upcoming_event
            }
            mentee_data.append(mentee_info)
        
        response_data = {
            'mentees': mentee_data,
            'stats': {
                'total_mentees': len(mentee_data),
                'unread_messages': unread_messages,
                'upcoming_meetings': len(upcoming_meetings),
                'recent_achievements': len(recent_achievements)
            },
            'upcoming_meetings': [{
                'id': meeting.id,
                'title': meeting.title,
                'scheduled_at': meeting.scheduled_at,
                'mentee_name': f"{meeting.mentee.first_name} {meeting.mentee.last_name}",
                'status': meeting.status
            } for meeting in upcoming_meetings],
            'recent_achievements': [{
                'id': achievement.id,
                'title': achievement.name,
                'mentee_name': f"{achievement.mentee.user.first_name} {achievement.mentee.user.last_name}",
                'date_awarded': achievement.created_at
            } for achievement in recent_achievements]
        }
        
        return Response(response_data)
    
    except Mentor.DoesNotExist:
        return Response(
            {'detail': 'Mentor profile not found'},
            status=status.HTTP_404_NOT_FOUND
        )

@api_view(['POST'])
@permission_classes([AllowAny])
def test_auth(request):
    """Test authentication endpoint"""
    email = request.data.get('email')
    password = request.data.get('password')
    
    print(f"Attempting login with: {email}, {password}")
    
    user = authenticate(
        username=email,
        password=password
    )
    
    if user:
        print(f"Authentication successful for user: {user.email}")
        return Response({
            'success': True,
            'message': 'Authentication successful',
            'user': {
                'id': user.id,
                'email': user.email,
                'role': user.role
            }
        })
    else:
        print(f"Authentication failed for email: {email}")
        return Response({
            'success': False,
            'message': 'Authentication failed'
        }, status=status.HTTP_401_UNAUTHORIZED) 