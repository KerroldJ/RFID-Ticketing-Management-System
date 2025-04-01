from django.db import models
from django.contrib.auth.models import User

class UserProfile(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='profile')
    rfid_code = models.CharField(max_length=100, unique=True)

    def __str__(self):
        return f'{self.user.username} Profile'