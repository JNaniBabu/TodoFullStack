from rest_framework_simplejwt.tokens import RefreshToken
from django.contrib.auth import authenticate, get_user_model
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import IsAuthenticated
from django.utils import timezone
from datetime import date, timedelta

from .serializers import RegisterSerializer, ProfileSerializer, TodolistSerializer
from .models import TodoList

User = get_user_model()


@api_view(['POST'])
def Registration(request):
    email = request.data.get('email')

    if User.objects.filter(email=email).exists():
        return Response({'message': 'User already exists'}, status=400)

    serializer = RegisterSerializer(data=request.data)

    if serializer.is_valid():
        serializer.save()
        return Response({'message': 'Successfully registered'}, status=201)

    errors = {field: error[0] if isinstance(error, list) else error for field, error in serializer.errors.items()}
    return Response({'message': 'Validation failed', 'errors': errors}, status=status.HTTP_400_BAD_REQUEST)


@api_view(['POST'])
def Login(request):
    email = request.data.get('email')
    password = request.data.get('password')

    user = authenticate(request, username=email, password=password)

    if user:
        refresh = RefreshToken.for_user(user)
        profile = user.profile

        response = Response({
            'message': 'Login successful',
            'access': str(refresh.access_token),
            "profile_pic": profile.profile_pic.url if profile.profile_pic else None,
        })

        response.set_cookie(
                  key='refresh',
                  value=str(refresh),
                  httponly=True,
                 secure=True,
                 samesite='None',  
                  path='/'
                  )


        return response

    return Response({'message': 'Invalid credentials'}, status=401)




@api_view(['POST'])
def Refresh_Access_Token(request):
    refresh_token = request.COOKIES.get('refresh')

    if not refresh_token:
        return Response({'message': 'No refresh token found'}, status=401)

    try:
        refresh = RefreshToken(refresh_token)
        access_token = str(refresh.access_token)
        return Response({'access': access_token}, status=200)

    except Exception:
        return Response({'message': 'Refresh token expired'}, status=401)



@api_view(['POST'])
def Logout(request):
    try:
        refresh_token = request.COOKIES.get('refresh')

        if refresh_token:
            token = RefreshToken(refresh_token)
            token.blacklist()

        response = Response({"message": "Logged out"}, status=205)
        response.delete_cookie('refresh') 

        return response

    except Exception:
        return Response({"error": "Invalid token"}, status=400)



@api_view(['GET'])
@permission_classes([IsAuthenticated])
def ProfileData(request):
    profile = request.user.profile
    serializer = ProfileSerializer(profile, context={'request': request})


    data = {
        'name': request.user.name,
        'bio': serializer.data['bio'],
        'no_of_tasks': serializer.data['no_of_tasks'],
        'totalcompletion': serializer.data['totalcompletion'],
        'profile_pic': serializer.data['profile_pic'],
        'streak': serializer.data['streak']
    }

    return Response({"data": data})


@api_view(['PUT'])
@permission_classes([IsAuthenticated])
def UpdateProfileData(request):
    profile = request.user.profile

    serializer = ProfileSerializer(
    profile,
    data=request.data,
    partial=True,
    context={'request': request}
)

    if serializer.is_valid():
        serializer.save()
        return Response(serializer.data)

    return Response(serializer.errors, status=400)



@api_view(['GET'])
@permission_classes([IsAuthenticated])
def TodolistData(request):
    todolist = request.user.todolists.all().order_by('dateTime')
    serializer = TodolistSerializer(todolist, many=True)
    return Response(serializer.data)


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def AddToDo(request):
    serializer = TodolistSerializer(data=request.data)
    profile = request.user.profile

    if serializer.is_valid():
        serializer.save(user=request.user)
        profile.no_of_tasks += 1
        profile.save()
        return Response(serializer.data, status=201)

    return Response(serializer.errors, status=400)


@api_view(['PUT'])
@permission_classes([IsAuthenticated])
def SaveToDo(request, id):
    try:
        todo = request.user.todolists.get(id=id)
        todo.activity = request.data['activity']
        todo.save()
        return Response({'message': "save successful"})

    except TodoList.DoesNotExist:
        return Response({"error": "Todo not found"}, status=404)


@api_view(['DELETE'])
@permission_classes([IsAuthenticated])
def RemoveToDo(request, id):
    try:
        todo = request.user.todolists.get(id=id)
        todo.delete()
        return Response({"message": "Removed successfully"}, status=200)

    except TodoList.DoesNotExist:
        return Response({"error": "Todo not found"}, status=404)


@api_view(['PUT'])
@permission_classes([IsAuthenticated])
def DoneToDo(request, id):
    try:
        todo = request.user.todolists.get(id=id)
        profile = request.user.profile
        was_done = todo.done

        todo.done = not todo.done
        todo.save()

        if not was_done and todo.done:
            profile.totalcompletion += 1
        elif was_done and not todo.done:
            profile.totalcompletion -= 1

        if not was_done and todo.done:
            today = date.today()
            yesterday = today - timedelta(days=1)
            completed_today = request.user.todolists.filter(
                done=True,
                dateTime__date=today
            ).count()

            if completed_today >= 6:
                if profile.last_active_date == yesterday:
                    profile.streak += 1
                elif profile.last_active_date != today:
                    profile.streak = 1

                profile.last_active_date = today

        profile.save()

        serializer = TodolistSerializer(todo)
        return Response(serializer.data)

    except TodoList.DoesNotExist:
        return Response({"error": "Todo not found"}, status=404)



@api_view(['DELETE'])
@permission_classes([IsAuthenticated])
def Reset(request):
    today = timezone.now().date()
    todolist = request.user.todolists.filter(dateTime__lt=today)
    todolist.delete()
    return Response({'message': 'reseted successfully'})
