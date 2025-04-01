from django.db import models
from django.utils import timezone


class Card(models.Model):
    REGULAR = 'Regular'
    VIP = 'VIP'
    ACTIVATED = 'Activated'
    DEACTIVATED = 'Deactivated'

    STATUS_CHOICES = [
        (ACTIVATED, 'Activate'),
        (DEACTIVATED, 'Deactivate'),
    ]
    
    TYPE_CHOICES = [
        (REGULAR, 'Regular'),
        (VIP, 'VIP'),
    ]

    card_id = models.CharField(max_length=100, unique=True)
    status = models.CharField(max_length=15, choices=STATUS_CHOICES)
    type = models.CharField(max_length=15, choices=TYPE_CHOICES)
    office_name = models.CharField(max_length=255, null=True, blank=True)
    created_date = models.DateField(null=True, blank=True)
    created_time = models.CharField(max_length=10, null=True, blank=True)
    deactivated_at = models.DateTimeField(null=True, blank=True) 

    def __str__(self):
        return self.card_id

    def save(self, *args, **kwargs):
        if not self.created_date and not self.created_time:
            current_time = timezone.localtime(timezone.now())
            self.created_date = current_time.date()
            self.created_time = current_time.strftime('%I:%M %p')

        if self.pk:  
            original_status = Card.objects.get(pk=self.pk).status
            if original_status != self.status and self.status == self.DEACTIVATED:
                current_time = timezone.localtime(timezone.now())
                self.created_date = current_time.date()
                self.created_time = current_time.strftime('%I:%M %p')
        super().save(*args, **kwargs)

    def get_date(self):
        return self.created_date if self.created_date else "Unknown Date"
    
    def get_time(self):
        return self.created_time if self.created_time else "Unknown Time"