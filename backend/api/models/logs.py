from django.db import models
from django.utils import timezone
    
class Log(models.Model):
    card_id = models.CharField(max_length=50, null=True)
    status = models.CharField(max_length=50)
    role = models.CharField(max_length=50, default="Admin")
    type = models.CharField(max_length=10, null=True, blank=True)  
    date = models.DateField(default=timezone.localdate)  
    time = models.TimeField(default=timezone.now)  
    
    def __str__(self):
        formatted_time = self.time.strftime('%I:%M %p')
        return (f"Card ID: {self.card_id}, Status: {self.status}, Role: {self.role}, "
                f"Type: {self.type or 'Unknown'}, Date: {self.date}, Time: {formatted_time}")

    def save(self, *args, **kwargs):
        if not self.date:
            self.date = timezone.localdate() 
        if not self.time:
            self.time = timezone.localtime().time()
        super().save(*args, **kwargs)