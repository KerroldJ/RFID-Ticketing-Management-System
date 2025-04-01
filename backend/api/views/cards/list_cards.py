from rest_framework import status
from rest_framework.decorators import api_view
from rest_framework.response import Response
from ...models import Card
from ...serializers import CardSerializer

@api_view(['GET'])
def card_list(request):
    cards = Card.objects.all()
    serializer = CardSerializer(cards, many=True)
    return Response(serializer.data)