from django.urls import path,include
from rest_framework.routers import DefaultRouter
from cliente.views import ClienteViewSet

router = DefaultRouter()
router.register(r'cliente',ClienteViewSet)

urlpatterns = [
    path('',include(router.urls))
]