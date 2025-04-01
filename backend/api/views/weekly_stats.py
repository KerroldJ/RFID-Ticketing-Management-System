from rest_framework import status
from rest_framework.decorators import api_view
from rest_framework.response import Response
from django.db.models.functions import TruncDay
from django.db.models import Count
from django.utils import timezone
from datetime import timedelta
from ..models.logs import Log



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