from django.utils import timezone
from .models import Log

def create_log(card_id, status, role=None, card_type=None):
    role = role or "Admin"
    card_type = card_type or "Unknown"

    try:
        current_time = timezone.localtime(timezone.now())
        log_entry = Log.objects.create(
            card_id=card_id,
            status=status,
            role=role,
            type=card_type,
            date=current_time.date(),
            time=current_time.time()
        )
        return log_entry
    except Exception as e:
        raise ValueError(f"Failed to create log: {str(e)}")