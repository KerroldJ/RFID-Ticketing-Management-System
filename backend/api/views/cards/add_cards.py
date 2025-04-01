from rest_framework import status
from rest_framework.decorators import api_view
from rest_framework.response import Response
from ...serializer.card_serializer import CardSerializer
from ..logs.create_log import create_log

@api_view(['POST'])
def card_create(request):
    serializer = CardSerializer(data=request.data)
    if serializer.is_valid():
        try:
            card = serializer.save()
            create_log(
                card_id=card.card_id,
                status="Created",
                card_type=card.type,
            )
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        except Exception as e:
            return Response(
                {"error": f"Failed to create log or save card: {str(e)}"},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR,
            )
    else:
        error_details = {
            "error": "Invalid data provided",
            "details": serializer.errors
        }
        return Response(error_details, status=status.HTTP_400_BAD_REQUEST)