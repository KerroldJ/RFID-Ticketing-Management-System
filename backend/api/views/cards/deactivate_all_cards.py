from rest_framework import status
from rest_framework.decorators import api_view
from rest_framework.response import Response

from ...models.cards import Card
from ...models.deactivated_cards import DeactivatedCard
from django.utils import timezone
from django.contrib.auth import get_user_model
   

@api_view(['POST'])
def deactivate_all_cards(request):
    password = request.data.get('password')
    if not password:
        return Response({'error': 'Password is required'}, status=status.HTTP_400_BAD_REQUEST)
    user = get_user_model().objects.filter(is_superuser=True).first()
    if user and user.check_password(password):
        cards_to_deactivate = Card.objects.filter(status='Activated', type='Regular')
        
        if cards_to_deactivate.exists():
            now = timezone.localtime(timezone.now())
            cards_to_deactivate.update(status='Deactivated', deactivated_at=now)
            deactivated_cards = [
                DeactivatedCard(
                    card_id=card.card_id,
                    status='Deactivated',
                    deactivated_date=now.date(),
                    deactivated_time=now.strftime('%I:%M %p')
                )
                for card in cards_to_deactivate
            ]
            DeactivatedCard.objects.bulk_create(deactivated_cards)

            return Response({'success': True, 'message': 'All activated cards have been deactivated successfully.'}, status=status.HTTP_200_OK)
        
        return Response({'success': False, 'message': 'No Regular Cards to Deactivate.'}, status=status.HTTP_200_OK)

    return Response({'error': 'Invalid password.'}, status=status.HTTP_401_UNAUTHORIZED)