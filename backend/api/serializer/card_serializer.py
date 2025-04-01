from rest_framework import serializers
from ..models.cards import Card

class CardSerializer(serializers.ModelSerializer):
    date = serializers.SerializerMethodField()
    time = serializers.SerializerMethodField()

    class Meta:
        model = Card
        fields = ['id', 'card_id', 'status','office_name', 'type', 'date', 'time']

    def get_date(self, obj):
        return obj.get_date()

    def get_time(self, obj):
        return obj.get_time()  