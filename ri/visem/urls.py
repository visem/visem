from django.conf.urls import include, url
from . import views

urlpatterns = [
        #url(r'^$', views.home_ri),
        url(r'^$', views.visem),
        url(r'^visem/$', views.visem),
        url(r'^visem/index.html$', views.index),
        url(r'^visem/dashboard.html$', views.dashboard),
        url(r'^visem/heatmap.html$', views.heatmap),
        
        # visem/slice/1
	url(r'^visem/slice/(?P<slice_id>[0-9]+)/$', views.slice_details, name='slice_details'),
	# visem/slice/create
	url(r'^visem/slice/create/$', views.slice_create, name='slice_create'),
	# visem/slice/list
	url(r'^visem/slice/list/$', views.slice_list, name='slice_list'),
        url(r'^visem/slice/(?P<slice_id>[0-9]+)/json/$', views.slice_details_json, name='slice_details_json'),
        url(r'^visem/slice/json/$', views.slice_get_all, name='slice_get_all')
]
