from .serializer import ClienteSerializer
from .models import ClienteModel
from rest_framework import viewsets

class ClienteViewSet(viewsets.ModelViewSet):
    queryset = ClienteModel.objects.all()
    serializer_class = ClienteSerializer