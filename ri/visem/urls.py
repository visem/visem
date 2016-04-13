from django.conf.urls import include, url
from . import views

urlpatterns = [
        #url(r'^$', views.home_ri),
        url(r'^$', views.visem),
        url(r'^visem/$', views.visem),
        url(r'^visem/index.html$', views.index),
        url(r'^visem/dashboard.html$', views.dashboard),
        url(r'^visem/heatmap.html$', views.heatmap),
]
