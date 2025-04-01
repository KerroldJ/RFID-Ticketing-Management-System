from rest_framework import status
from rest_framework.decorators import api_view
from rest_framework.response import Response
from ..models import Log
from ..serializers import LogSerializer
from django.contrib.auth import get_user_model


@api_view(['GET', 'DELETE'])
def log_list(request):
    if request.method == 'GET':
        logs = Log.objects.all().order_by('-date', '-time')
        serializer = LogSerializer(logs, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)

    elif request.method == 'DELETE':
        password = request.data.get('password')

        if not password:
            return Response({'error': 'Password is required'}, status=status.HTTP_400_BAD_REQUEST)
        user = get_user_model().objects.filter(is_superuser=True).first()
        if not user or not user.check_password(password):
            return Response({'error': 'Unauthorized access'}, status=status.HTTP_401_UNAUTHORIZED)
        Log.objects.all().delete()
        return Response({"message": "All logs deleted successfully"}, status=status.HTTP_204_NO_CONTENT)