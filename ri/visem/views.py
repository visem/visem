from django.shortcuts import render
from models import Slicer
from .forms import SliceForm
from django.shortcuts import get_object_or_404
from django.http import JsonResponse

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
    slice = get_object_or_404(Slicer, pk=slice_id)
    return render(request, 'visem/slicedetails.html', {'slice': slice})


def slice_list(request):
    slice_list = Slicer.objects.all()
    context = {'slice_list': slice_list}
    return render(request, 'visem/slicelist.html', context)


def slice_create(request):

    if (request.method == 'POST'):
        form = SliceForm(request.POST)
        if request.method == "POST" and form.is_valid():
            slice = Slicer(slice_h=int(form.cleaned_data['slice_h']), slice_v=int(form.cleaned_data['slice_v']))
            slice.save()
            return render(request, 'visem/ok.html')
    else:
        form = SliceForm()
        
    return render(request, 'visem/slicecreate.html', {'form': form})


def slice_details_json(request, slice_id):
    slice = get_object_or_404(Slicer, pk=slice_id)
    slice_json = {"slice_h":slice.slice_h, "slice_v":slice.slice_v}
    return JsonResponse(slice_json)