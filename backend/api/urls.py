from django.urls import path
from .views1 import task_list_brief, register_view,TaskAPIList, TaskDetailAPI, LogoutView
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView

urlpatterns = [
    path('tasks/brief/', task_list_brief, name='task-list-brief'),
    path('register/', register_view, name='register'),
    path('tasks/', TaskAPIList.as_view(), name='task-list'),
    path('tasks/<int:pk>/', TaskDetailAPI.as_view(), name='task-detail'),
    path('login/', TokenObtainPairView.as_view()),
    path('token/refresh/', TokenRefreshView.as_view()),
    path('logout/', LogoutView.as_view()),

]