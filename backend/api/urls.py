from django.urls import path
from .views import task_list, register_view

urlpatterns = [
    path('tasks/', task_list, name='task-list'),
    path('register/', register_view, name='register'),
]