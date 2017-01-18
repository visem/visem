from django.shortcuts import render

# Create your views here.

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

	
def slice_details(request, slice_id):
    slice = get_object_or_404(Slice, pk=slice_id)
    return render(request, 'visem/slicedetails.html', {'slice': slice})


def slice_list(request):
    slice_list = Slice.objects.all()
    context = {'slice_list': slice_list}
    return render(request, 'visem/slicelist.html', context)


def slice_create(request):
	if request.method == 'POST':
		form = SliceForm(request.POST)
		if form.is_valid():
			slice = Slice(slice_h=form.slice_h, slice_v=form.slice_h)
			slice.save()
		return render(request, 'visem/slice/error.html')
	else:
        form = SliceForm()

    return render(request, 'slice_create.html', {'form': form})