from rest_framework import status
from rest_framework.decorators import api_view
from rest_framework.response import Response
from django.utils import timezone
from ...models.cards import Card
from ..logs.create_log import create_log



@api_view(['POST'])
def reactivate_card(request, card_id):
    try:
        card_instance = Card.objects.get(card_id=card_id)
        
        if card_instance.status == 'Deactivated':
            now_local = timezone.localtime()
            created_date = now_local.date()
            created_time = now_local.strftime('%I:%M %p')

            if card_instance.type == 'VIP':
                office_name = request.data.get('office_name', None)
                if not office_name:
                    return Response({
                        'success': False,
                        'message': 'Office name is required for VIP cards.'
                    }, status=status.HTTP_400_BAD_REQUEST)
                card_instance.office_name = office_name 

            card_instance.status = 'Activated'
            card_instance.created_date = created_date
            card_instance.created_time = created_time
            card_instance.save()

            create_log(
                card_id=card_instance.card_id,
                status="Reactivated",
                card_type=card_instance.type,
            )

            return Response({
                'success': True,
                'message': 'Card reactivated successfully.',
                'activated_date': created_date,
                'activated_time': created_time
            })

        else:
            return Response({
                'success': False,
                'message': 'Card is already activated.'
            }, status=status.HTTP_400_BAD_REQUEST)
    
    except Card.DoesNotExist:
        return Response({
            'success': False,
            'message': 'Card with ID not found.'
        }, status=status.HTTP_404_NOT_FOUND)