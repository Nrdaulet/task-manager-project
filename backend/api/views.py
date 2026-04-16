from django.shortcuts import render
from rest_framework import status
from rest_framework.response import Response
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated,AllowAny
from rest_framework.views import APIView
from .models import Task
from .serializers import *

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def task_list (request):
    tasks=Task.objects.filter(user=request.user)
    return Response({'tasks':TaskSerializer(tasks, many=True).data})

@api_view(['POST'])
@permission_classes([AllowAny])
def register_view(request):
    serializer=RegisterSerializer(data=request.data)
    serializer.is_valid(raise_exception=True)
    user=serializer.save()

    return Response({'message': 'User created successfully',
            'username': user.username,
            'email': user.email,}, status=status.HTTP_201_CREATED)  

class TaskAPIList(APIView):
    permission_classes = [IsAuthenticated]
    def get(self, request):
        tasks=Task.objects.filter(user=request.user)
        serializer=TaskSerializer(tasks,many=True)
        return Response({'tasks':serializer.data})
    def post(self,request):
        serializer=TaskSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        serializer.save(user=request.user)

        return Response({'tasks':serializer.data})
    
class TaskAPIDetail(APIView):
    permission_classes = [IsAuthenticated]

    def get_object(self, pk, user):
        try:
            return Task.objects.get(pk=pk, user=user)
        except Task.DoesNotExist:
            return None
    def put(self, request, pk):
        object=self.get_object
        