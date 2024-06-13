from . import views
from django.urls import path
from django.conf import settings
from django.conf.urls.static import static

urlpatterns = [
    path('sub=<int:sub_id>&per=<int:per_page>', views.dashboard, name='Dashboard'),

] + static(settings.STATIC_URL, document_root=settings.STATIC_ROOT)