from rest_framework import status
from rest_framework.decorators import api_view
from rest_framework.response import Response
from django.contrib.auth.models import User


@api_view(['POST'])
def rfid_login_view(request):
    rfid_code = request.data.get('rfidCode')

    if not rfid_code:
        return Response({'error': 'RFID code is required'}, status=status.HTTP_400_BAD_REQUEST)
    try:
        user = User.objects.get(profile__rfid_code=rfid_code)
        if not user.is_superuser:
            return Response({
                'error': 'You are not authorized to access the admin page.'
            }, status=status.HTTP_403_FORBIDDEN)
        return Response({
            'message': 'Login successful',
            'userRole': 'admin', 
        }, status=status.HTTP_200_OK)

    except User.DoesNotExist:
        return Response({
            'error': 'Invalid RFID code'
        }, status=status.HTTP_401_UNAUTHORIZED)