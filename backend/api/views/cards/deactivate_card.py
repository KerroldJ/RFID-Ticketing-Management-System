from rest_framework import status
from rest_framework.decorators import api_view
from rest_framework.response import Response

from django.utils import timezone
from ...models import Card, DeactivatedCard
from ...utils import create_log

@api_view(['POST'])
def deactivate_card(request, card_id):
    try:
        deactivated_date = request.data.get('deactivated_date')
        deactivated_time = request.data.get('deactivated_time')
        deactivated = Card.objects.get(card_id=card_id)
        if deactivated.type == 'VIP':
            deactivated.office_name = None 
        deactivated.status = 'Deactivated'
        deactivated.deactivated_date = deactivated_date
        deactivated.deactivated_time = deactivated_time
        deactivated.save()
        if not DeactivatedCard.objects.filter(card_id=card_id).exists():
            local_time = timezone.localtime(timezone.now())
            DeactivatedCard.objects.create(
                card_id=deactivated.card_id,
                status='Deactivated',
                deactivated_date=local_time.date(),
                deactivated_time=local_time.strftime('%I:%M %p')
            )
        create_log(
            card_id=deactivated.card_id,  
            status="Deactivated", 
            card_type=deactivated.type
        )

        return Response({'success': True, 'message': 'Card deactivated successfully.'})

    except Card.DoesNotExist:
        return Response({'success': False, 'message': 'Card not found.'}, status=status.HTTP_404_NOT_FOUND)
    except Exception as e:
        return Response({'success': False, 'message': str(e)}, status=status.HTTP_400_BAD_REQUEST)