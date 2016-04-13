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