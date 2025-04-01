from rest_framework import status
from rest_framework.decorators import api_view
from rest_framework.response import Response

from ...models.cards import Card

@api_view(['GET'])
def check_card(request, card_id):
    try:
        card = Card.objects.get(card_id=card_id)
        return Response({
            'isRegistered': True,
            'status': card.status,
            'type':card.type,
            'office_name':card.office_name
        })
    except Card.DoesNotExist:
        return Response({'isRegistered': False}, status=status.HTTP_404_NOT_FOUND)
