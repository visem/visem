from django.shortcuts import render
from models import Slice
from .forms import SliceForm
from django.shortcuts import get_object_or_404
from django.http import JsonResponse
from django.core import serializers
import json

def home_page(request):
    return render(request, 'visem/home_page.html',{})

def home_ri(request):
    return render(request, 'visem/home_ri.html',{})

def index(request):
    return render(request, 'visem/index.html',{})

def dashboard(request):
	return render(request, 'visem/dashboard.html',{})

def heatmap(request):
	return render(request, 'visem/heatmap.html',{})

def visem(request):
	return render(request, 'visem/visem.html',{})
	
def sliceform(request):
    return render(request, 'visem/sliceform.html',{})
    
def slice_details(request, slice_id):
    slice = get_object_or_404(Slice, pk=slice_id)
    return render(request, 'visem/slicedetails.html', {'slice': slice})


def slice_list(request):
    slice_list = Slice.objects.all()
    context = {'slice_list': slice_list}
    return render(request, 'visem/slicelist.html', context)


def slice_create(request):

    if (request.method == 'POST'):
        form = SliceForm(request.POST)
        if request.method == "POST" and form.is_valid():
            slice_h = int(form.cleaned_data['slice_h'])
            slice_v = int(form.cleaned_data['slice_v'])
            
            for s in range(1, slice_h):
                h_slice = Slice(slice_type='horizontal', slice_position=int(10*s))
                h_slice.save()
                
            for s in range(1, slice_v): 
                v_slice = Slice(slice_type='vertical', slice_position=int(10*s))
                v_slice.save()
            return render(request, 'visem/ok.html')
    else:
        form = SliceForm()
        
    return render(request, 'visem/slicecreate.html', {'form': form})


def slice_details_json(request, slice_id):
    slice = get_object_or_404(Slice, pk=slice_id)
    slice_json = {"slice_id":slice.id, "slice_type":slice.slice_type, "slice_position":slice.slice_position}
    return JsonResponse(slice_json)
    
def slice_get_all(request):
    slices = Slice.objects.values("slice_type","slice_position")
    print slices
    slices_json = {}
    #for slice in slices:
       # slices_json = {"slice_id":slice.id, "slice_type":slice.slice_type, "slice_position":slice.slice_position}
    slices_json = json.dumps(serializers.serialize("json", slices))
    return JsonResponse(dict(slices), safe=False)