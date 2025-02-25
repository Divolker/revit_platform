# categories/api_urls.py
from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import CategoryViewSet

router = DefaultRouter()
router.register('', CategoryViewSet)

urlpatterns = router.urls
