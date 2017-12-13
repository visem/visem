from django.db import models

# Create your models here.

class Slice(models.Model):
    slice_type = models.CharField(max_length=255, null=True, default=None)
    slice_position = models.FloatField(default=None)
    
    def as_dict(self):
        return dict(slice_id=self.pk, slice_type=self.slice_type, slice_position=self.slice_position)
    