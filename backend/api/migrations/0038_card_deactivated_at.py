# Generated by Django 5.1.4 on 2025-02-04 14:38

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('api', '0037_alter_log_time_alter_log_type'),
    ]

    operations = [
        migrations.AddField(
            model_name='card',
            name='deactivated_at',
            field=models.DateTimeField(blank=True, null=True),
        ),
    ]
