from rest_framework.decorators import api_view
from rest_framework.response import Response
from ...models import Card, DeactivatedCard
from django.utils import timezone


@api_view(['POST'])
def autodeactivate_cards(request):
    now = timezone.localtime(timezone.now())
    if now.hour == 19 and now.minute == 0:
        cards_to_deactivate = Card.objects.filter(status='Activated', type='Regular')      
        if cards_to_deactivate.exists():
            for card in cards_to_deactivate:
                card.status = 'Deactivated'
                card.deactivated_at = now
                card.save()
                DeactivatedCard.objects.create(
                    card_id=card.card_id, 
                    status='Deactivated',
                    deactivated_date=now.date(),
                    deactivated_time=now.strftime('%I:%M %p')
                )
            return Response({'success': True, 'message': 'All regular cards deactivated and saved successfully.'})
        else:
            return Response({'success': False, 'message': 'No activated regular cards found to deactivate.'})
    else:
        return Response({'success': False, 'message': 'It is not time to deactivate cards yet.'})
