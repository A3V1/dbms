from rest_framework import permissions

class IsMentorOrMentee(permissions.BasePermission):
    def has_permission(self, request, view):
        return request.user.role in ['mentor', 'mentee']

class IsMentor(permissions.BasePermission):
    def has_permission(self, request, view):
        return request.user.role == 'mentor'

class IsMentee(permissions.BasePermission):
    def has_permission(self, request, view):
        return request.user.role == 'mentee' 