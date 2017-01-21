from django.db import models

# Create your models here.

class Slicer(models.Model):
    slice_h = models.IntegerField()
    slice_v = models.IntegerField()
    
    def cadastrar(self):
        self.save()
    
    def __str__(self):
        pass