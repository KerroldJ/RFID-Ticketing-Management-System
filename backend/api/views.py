from rest_framework import status
from rest_framework.decorators import api_view
from rest_framework.response import Response

from django.contrib.auth.models import User
from django.contrib.auth import authenticate

from .models import Card, DeactivatedCard, Log
from .serializers import CardSerializer, LogSerializer
from .utils import create_log

from django.db.models.functions import TruncDay
from django.db.models import Count
from django.utils import timezone
from datetime import timedelta

from django.contrib.auth import get_user_model


#======================================================#
@api_view(['POST'])
def rfid_login_view(request):
    rfid_code = request.data.get('rfidCode')

    if not rfid_code:
        return Response({'error': 'RFID code is required'}, status=status.HTTP_400_BAD_REQUEST)
    try:
        user = User.objects.get(profile__rfid_code=rfid_code)
        if not user.is_superuser:
            return Response({
                'error': 'You are not authorized to access the admin page.'
            }, status=status.HTTP_403_FORBIDDEN)
        return Response({
            'message': 'Login successful',
            'userRole': 'admin', 
        }, status=status.HTTP_200_OK)

    except User.DoesNotExist:
        return Response({
            'error': 'Invalid RFID code'
        }, status=status.HTTP_401_UNAUTHORIZED)
#======================================================#
@api_view(['POST'])
def login_view(request):
    username = request.data.get('username')  
    password = request.data.get('password')
    
    if not username or not password:
        return Response({'error': 'Username and password are required'}, status=status.HTTP_400_BAD_REQUEST)
    user = authenticate(username=username, password=password)

    if user:
        if user.is_superuser:
            user_role = 'admin'
        elif user.is_staff:
            user_role = 'staff'
        else:
            user_role = 'user'
        return Response({
            'message': 'Login successful',
            'userRole': user_role,
        }, status=status.HTTP_200_OK)
    else:
        return Response({
            'error': 'Invalid credentials'
        }, status=status.HTTP_401_UNAUTHORIZED)
#======================================================#
@api_view(['POST'])
def update_password(request):
    username = request.data.get('username') 
    old_password = request.data.get('old_password') 
    new_password = request.data.get('new_password') 
    
    if not username or not old_password or not new_password:
        return Response({'error': 'Username, old password, and new password are required'}, 
                        status=status.HTTP_400_BAD_REQUEST)
    user = authenticate(username=username, password=old_password)

    if user:
        if old_password == new_password:
            return Response({'error': 'New password cannot be the same as the old password'},
                            status=status.HTTP_400_BAD_REQUEST)
        user.set_password(new_password)
        user.save()
        return Response({'message': 'Password updated successfully'}, 
                        status=status.HTTP_200_OK)
    else:
        return Response({'error': 'Invalid username or old password'}, 
                        status=status.HTTP_401_UNAUTHORIZED)
        
#======================================================#
@api_view(['GET', 'POST', 'DELETE'])
def card_list_create(request):
    if request.method == 'GET':
        cards = Card.objects.all()
        serializer = CardSerializer(cards, many=True)
        return Response(serializer.data)
    elif request.method == 'POST':
        serializer = CardSerializer(data=request.data)
        if serializer.is_valid():
            try:
                card = serializer.save()
                create_log(
                    card_id=card.card_id,
                    status="Created",
                    card_type=card.type,
                )
                return Response(serializer.data, status=status.HTTP_201_CREATED)
            except Exception as e:
                return Response(
                    {"error": f"Failed to create log or save card: {str(e)}"},
                    status=status.HTTP_500_INTERNAL_SERVER_ERROR,
                )
        else:
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    elif request.method == 'DELETE':
        try:
            Card.objects.all().delete()
            create_log(
                card_id="ALL", 
                status="Deleted",
            )
            return Response(
                {"message": "All cards have been deleted."}, status=status.HTTP_204_NO_CONTENT
            )
        except Exception as e:
            return Response(
                {"error": f"Failed to delete cards or create log: {str(e)}"},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR,
            )

#======================================================#
# View to check the status of a card by card_id
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


#======================================================#
# Inside deactivate_card view or any other view that updates the card
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


#======================================================#      
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
        
#======================================================#
@api_view(['GET'])
def weekly_deactivated_cards(request):
    try:
        local_time = timezone.localtime(timezone.now())
        start_of_week = local_time - timedelta(days=local_time.weekday())
        start_of_week = start_of_week.replace(hour=0, minute=0, second=0, microsecond=0)
        end_of_week = start_of_week + timedelta(days=6)
        end_of_week = end_of_week.replace(hour=23, minute=59, second=59, microsecond=999999)    
        weekly_data = (
            Log.objects.filter(status='Deactivated', date__range=[start_of_week, end_of_week])
            .annotate(day_of_week=TruncDay('date'))
            .values('day_of_week')
            .annotate(count=Count('id'))
            .order_by('day_of_week')
        )        
        data = [0] * 7
        for item in weekly_data:
            day_of_week = item['day_of_week'].weekday()
            data[day_of_week] += item['count']
          
        labels = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"]   
        current_day = local_time.strftime('%A')
        response_data = {
            "labels": labels,
            "data": data,
            "current_day": current_day,
        }
        
        return Response(response_data, status=status.HTTP_200_OK)
    
    except Exception as e:
        return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)
#======================================================#
@api_view(['GET', 'DELETE'])
def log_list(request):
    if request.method == 'GET':
        logs = Log.objects.all().order_by('-date', '-time')
        serializer = LogSerializer(logs, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)

    elif request.method == 'DELETE':
        password = request.data.get('password')

        if not password:
            return Response({'error': 'Password is required'}, status=status.HTTP_400_BAD_REQUEST)
        user = get_user_model().objects.filter(is_superuser=True).first()
        if not user or not user.check_password(password):
            return Response({'error': 'Unauthorized access'}, status=status.HTTP_401_UNAUTHORIZED)
        Log.objects.all().delete()
        return Response({"message": "All logs deleted successfully"}, status=status.HTTP_204_NO_CONTENT)

#======================================================#
@api_view(['POST'])
def deactivate_all_cards(request):
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

#======================================================# 
@api_view(['POST'])
def all_cards_deactivate(request):
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
#======================================================# 
@api_view(['DELETE'])
def delete_all_cards(request):
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
