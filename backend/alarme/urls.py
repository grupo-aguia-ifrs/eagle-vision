from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import AlarmeViewSet

router = DefaultRouter()
router.register(r'alarmes', AlarmeViewSet)

urlpatterns = [
    path('', include(router.urls)),
]