from django import forms

class SliceForm(forms.Form):
    slice_h = forms.IntegerField(label='slice h', required=True)
    slice_v = forms.IntegerField(label='slice v', required=True)