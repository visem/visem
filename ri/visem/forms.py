from django import forms

class SliceForm(forms.Form):
    slice_h = forms.IntegerField(label='slice h', max_length=5, required=True)
	slice_v = forms.IntegerField(label='slice v', max_length=5, required=True)