from django.urls import path, include
from rest_framework.routers import DefaultRouter
from . import views

router = DefaultRouter()
router.register(r'categories', views.CategoryViewSet, basename='category')
router.register(r'families', views.FamilyViewSet, basename='family')

app_name = 'revit_families'

urlpatterns = router.urls