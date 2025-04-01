from rest_framework import status
from rest_framework.decorators import api_view
from rest_framework.response import Response
from ...models.logs import Log
from ...serializer.log_serializer import LogSerializer

@api_view(['GET'])
def list_logs(request):
    logs = Log.objects.all().order_by('-date', '-time')
    serializer = LogSerializer(logs, many=True)
    return Response(serializer.data, status=status.HTTP_200_OK)