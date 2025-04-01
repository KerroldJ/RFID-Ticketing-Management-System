from rest_framework import serializers
from ..models.deactivated_cards import DeactivatedCard

class DeactivatedCardSerializer(serializers.ModelSerializer):
    class Meta:
        model = DeactivatedCard
        fields = ['id', 'card_id', 'status', 'deactivated_date', 'deactivated_time']