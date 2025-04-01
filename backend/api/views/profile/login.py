from rest_framework import status
from rest_framework.decorators import api_view
from rest_framework.response import Response
from django.contrib.auth import authenticate


@api_view(['POST'])
def login_view(request):
    username = request.data.get('username')  
    password = request.data.get('password')
    
    if not username or not password:
        return Response({'error': 'Username and password are required'}, status=status.HTTP_400_BAD_REQUEST)
    user = authenticate(username=username, password=password)

    if user:
        if user.is_superuser:
            user_role = 'admin'
        elif user.is_staff:
            user_role = 'staff'
        else:
            user_role = 'user'
        return Response({
            'message': 'Login successful',
            'userRole': user_role,
        }, status=status.HTTP_200_OK)
    else:
        return Response({
            'error': 'Invalid credentials'
        }, status=status.HTTP_401_UNAUTHORIZED)