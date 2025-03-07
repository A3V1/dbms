"""
URL configuration for mentor_mentee_system project.

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/5.1/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.contrib import admin
from django.urls import path, include
from django.http import JsonResponse
from rest_framework import permissions
from drf_yasg.views import get_schema_view
from drf_yasg import openapi
from rest_framework_simplejwt.views import TokenRefreshView
from .views import (
    RegisterView, LoginView, logout, UserViewSet, 
    get_user_profile, get_mentor_dashboard, test_auth
)
from rest_framework.routers import DefaultRouter

# Add a simple root view
def api_root(request):
    return JsonResponse({
        'message': 'Welcome to Mentor-Mentee System API',
        'version': '1.0.0',
        'endpoints': {
            'admin': '/admin/',
            'users': '/api/users/',
            'achievements': '/api/achievements/',
            'communication': '/api/communication/',
            'meetings': '/api/meetings/',
            'activity_logs': '/api/activity-logs/',
        }
    })

# API documentation schema
schema_view = get_schema_view(
    openapi.Info(
        title="Mentor-Mentee API",
        default_version='v1',
        description="API documentation for Mentor-Mentee System",
    ),
    public=True,
    permission_classes=[permissions.AllowAny],
)

router = DefaultRouter()
router.register(r'users', UserViewSet, basename='user')

urlpatterns = [
    # Root path
    path('', api_root, name='api-root'),
    
    # Admin
    path('admin/', admin.site.urls),
    
    # API Documentation
    path('swagger/', schema_view.with_ui('swagger', cache_timeout=0)),
    path('redoc/', schema_view.with_ui('redoc', cache_timeout=0)),
    
    # Authentication URLs
    path('api/auth/register/', RegisterView.as_view(), name='register'),
    path('api/auth/login/', LoginView.as_view(), name='login'),
    path('api/auth/logout/', logout, name='logout'),
    path('api/auth/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    
    # User Profile URLs
    path('api/profile/', get_user_profile, name='user-profile'),
    
    # Dashboard URLs
    path('api/mentor/dashboard/', get_mentor_dashboard, name='mentor-dashboard'),
    
    # Test authentication URL
    path('api/test-auth/', test_auth, name='test-auth'),
    
    # Include router URLs
    path('api/', include(router.urls)),
]
