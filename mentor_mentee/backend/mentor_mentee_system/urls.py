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

urlpatterns = [
    # Root path
    path('', api_root, name='api-root'),
    
    # Admin
    path('admin/', admin.site.urls),
    
    # API Documentation
    path('swagger/', schema_view.with_ui('swagger', cache_timeout=0)),
    path('redoc/', schema_view.with_ui('redoc', cache_timeout=0)),
    
    # API endpoints
    path('api/', include('mentor_mentee_system.apps.users.urls')),
]
