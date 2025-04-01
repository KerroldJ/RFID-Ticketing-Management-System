from rest_framework.decorators import api_view
from rest_framework.response import Response
from ...models.cards import Card
from ...serializer.card_serializer import CardSerializer

@api_view(['GET'])
def card_list(request):
    cards = Card.objects.all()
    serializer = CardSerializer(cards, many=True)
    return Response(serializer.data)