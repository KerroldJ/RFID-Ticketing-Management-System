from rest_framework import status
from rest_framework.decorators import api_view
from rest_framework.response import Response
from ...models import Card
from django.contrib.auth import get_user_model


@api_view(['DELETE'])
def card_delete_all(request):
    if request.method == 'DELETE':
        try:
            password = request.data.get('password')
            
            if not password:
                return Response({'error': 'Password is required'}, status=status.HTTP_400_BAD_REQUEST)
            user = get_user_model().objects.filter(is_superuser=True).first()

            if user:
                if user.check_password(password):
                    if not Card.objects.exists():
                        return Response({"message": "No Cards to Delete"}, status=status.HTTP_404_NOT_FOUND)
                    Card.objects.all().delete()
                    return Response({"message": "All cards have been deleted"}, status=status.HTTP_204_NO_CONTENT)
                else:
                    return Response({"error": "Invalid password"}, status=status.HTTP_403_FORBIDDEN)
            else:
                return Response({"error": "No admin user found"}, status=status.HTTP_404_NOT_FOUND)
        
        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)
