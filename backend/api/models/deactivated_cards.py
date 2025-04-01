from django.db import models
from django.utils import timezone
from ..models.logs import Log

class DeactivatedCard(models.Model):
    card_id = models.CharField(max_length=100)
    status = models.CharField(max_length=15, default='Deactivated')
    deactivated_date = models.DateField(null=True, blank=True)
    deactivated_time = models.CharField(max_length=10, null=True, blank=True)

    def __str__(self):
        return f"Card {self.card_id} - {self.status}"

    def save(self, *args, **kwargs):
        if self.status == 'Deactivated' and (not self.deactivated_date or not self.deactivated_time):
            local_time = timezone.localtime(timezone.now())
            self.deactivated_date = self.deactivated_date or local_time.date()
            self.deactivated_time = self.deactivated_time or local_time.strftime('%I:%M %p')

        super().save(*args, **kwargs)
        Log.objects.create(card=self)