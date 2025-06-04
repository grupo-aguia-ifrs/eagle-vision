from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import CFTVViewSet

router = DefaultRouter()
router.register(r'cftvs', CFTVViewSet)

urlpatterns = [
    path('', include(router.urls)),
]
