from rest_framework import status
from rest_framework.decorators import api_view
from rest_framework.response import Response
from ...models import Card
from ...utils import create_log


@api_view(['DELETE'])
def card_delete(request, card_id):
    try:
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
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )