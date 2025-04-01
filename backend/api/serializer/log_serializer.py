from rest_framework import serializers
from ..models.logs import Log



class LogSerializer(serializers.ModelSerializer):
    date = serializers.DateField(format="%Y-%m-%d")
    time = serializers.SerializerMethodField() 

    class Meta:
        model = Log
        fields = ['card_id', 'status', 'role', 'type', 'date', 'time']

    def get_time(self, obj):
        if obj.time:
            return obj.time.strftime('%I:%M:%S %p')  
        return None
