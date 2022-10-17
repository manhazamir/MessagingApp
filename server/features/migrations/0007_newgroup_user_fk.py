# Generated by Django 4.1.2 on 2022-10-17 14:09

from django.conf import settings
from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('features', '0006_alter_user_options_alter_user_table'),
    ]

    operations = [
        migrations.AddField(
            model_name='newgroup',
            name='user_fk',
            field=models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.CASCADE, to=settings.AUTH_USER_MODEL),
        ),
    ]
