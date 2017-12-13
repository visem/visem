from django import forms
from .models import Slice

class SliceForm(forms.Form):

        slices_v = Slice.objects.filter(slice_type='vertical').count()
        slices_h = Slice.objects.filter(slice_type='horizontal').count()
        slice_h = forms.IntegerField(initial=slices_h, label='slice h', required=True)
        slice_v = forms.IntegerField(initial=slices_v, label='slice v', required=True)
