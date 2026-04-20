from django.shortcuts import render
from rest_framework import status
from rest_framework.response import Response
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated,AllowAny
from rest_framework.views import APIView
from .models import Task
from .serializers import *


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def task_list_brief(request):
    tasks = Task.objects.filter(user=request.user)
    data = [{"id": t.id, "title": t.title} for t in tasks]
    return Response({'task_brief':data})

@api_view(['POST'])
@permission_classes([AllowAny])
def register_view(request):
    serializer=RegisterSerializer(data=request.data)

    if serializer.is_valid():
        serializer.save()
        return Response(serializer.data, status=status.HTTP_201_CREATED)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class TaskAPIList(APIView):
    permission_classes=[IsAuthenticated]
    def get(self, request):
        tasks= Task.objects.filter(user=request.user)
        serializer=TaskSerializer(tasks,many=True)
        return Response({'full_tasks':serializer.data})
    def post(self,request):
        serializer=TaskSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        serializer.save(user=request.user)

        return Response({'task':serializer.data}, status=status.HTTP_201_CREATED)

class TaskDetailAPI(APIView):
    permission_classes=[IsAuthenticated]
    def get_object(self,pk, user):
        try:
            return Task.objects.get(pk=pk,user=user)
        except Task.DoesNotExist:
            return None
    
    def get(self, request, pk):
        task=self.get_object(pk, request.user)
        if task is None:
            return Response({'error':'Task is not found'}, status=status.HTTP_404_NOT_FOUND)
        serializer = TaskSerializer(task)
        return Response({'task':serializer.data})
 


    def put(self, request, pk):
        task=self.get_object(pk, request.user)

        if task is None:
            return Response({'error':'Task is not found'}, status=status.HTTP_404_NOT_FOUND)
        
        serializer=TaskSerializer(task, data=request.data)
        if serializer.is_valid():
            serializer.save(user=request.user)
            return Response(serializer.data, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
    def delete(self, request, pk):
        task=self.get_object(pk, request.user)
        if task is None:
            return Response({'error':'Task is not found'}, status=status.HTTP_404_NOT_FOUND)
        task.delete()
        return Response({"message":'Task deleted successfully'}, status=status.HTTP_204_NO_CONTENT)
    


class LogoutView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        try:
            refresh_token = request.data['refresh'] 
            token = RefreshToken(refresh_token)
            token.blacklist()

            return Response({'message': 'Logged out successfully'}, status=200)
        except Exception:
            return Response({'error':'Invalid token'}, status=400)