from rest_framework import status
from rest_framework.decorators import api_view
from rest_framework.response import Response
from ...models.cards import Card
from ..logs.create_log import create_log
from django.contrib.auth import get_user_model

@api_view(['DELETE'])
def card_delete(request, card_id):
    if request.method == 'DELETE':
        try:
            password = request.data.get('password')
            if not password:
                return Response(
                    {'error': 'Password is required'},
                    status=status.HTTP_400_BAD_REQUEST
                )
            user = get_user_model().objects.filter(is_superuser=True).first()
            if not user:
                return Response(
                    {"error": "No admin user found"},
                    status=status.HTTP_404_NOT_FOUND
                )
            if not user.check_password(password):
                return Response(
                    {"error": "Invalid password"},
                    status=status.HTTP_403_FORBIDDEN
                )
                
            card = Card.objects.get(card_id=card_id)
            card.delete()
            create_log(
                card_id=card_id,
                status="Deleted",
            )
            
            return Response(
                {"message": f"Card with ID {card_id} has been deleted."},
                status=status.HTTP_204_NO_CONTENT
            )

        except Card.DoesNotExist:
            return Response(
                {"error": f"Card with ID {card_id} not found."},
                status=status.HTTP_404_NOT_FOUND
            )
        except Exception as e:
            return Response(
                {"error": f"Failed to delete card or create log: {str(e)}"},
                status=status.HTTP_400_BAD_REQUEST
            )