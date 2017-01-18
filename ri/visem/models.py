from django.db import models

class Slicer(models.Model):
    slice_h = models.IntegerField()
    slice_v = models.IntegerField()
