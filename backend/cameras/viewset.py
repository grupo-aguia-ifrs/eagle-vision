from rest_framework import viewsets

from .model import Camera
from .seriallizer import CameraSeriallizar

class CameraViewSet(viewsets.ModelViewSet):
    queryset = Camera.objects.all()

    seriallizer_class = CameraSeriallizar