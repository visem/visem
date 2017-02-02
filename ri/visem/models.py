from django.db import models

# Create your models here.

class Slice(models.Model):
    slice_type = models.CharField(max_length=255, null=True, default=None)
    slice_position = models.FloatField(default=None)
    