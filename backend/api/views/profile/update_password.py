from rest_framework import status
from rest_framework.decorators import api_view
from rest_framework.response import Response
from django.contrib.auth import authenticate



@api_view(['POST'])
def update_password(request):
    username = request.data.get('username') 
    old_password = request.data.get('old_password') 
    new_password = request.data.get('new_password') 
    
    if not username or not old_password or not new_password:
        return Response({'error': 'Username, old password, and new password are required'}, 
                        status=status.HTTP_400_BAD_REQUEST)
    user = authenticate(username=username, password=old_password)

    if user:
        if old_password == new_password:
            return Response({'error': 'New password cannot be the same as the old password'},
                            status=status.HTTP_400_BAD_REQUEST)
        user.set_password(new_password)
        user.save()
        return Response({'message': 'Password updated successfully'}, 
                        status=status.HTTP_200_OK)
    else:
        return Response({'error': 'Invalid username or old password'}, 
                        status=status.HTTP_401_UNAUTHORIZED)