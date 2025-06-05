from rest_framework import viewsets

from .models import AlarmeModel
from .serializers import AlarmeSerializer

class AlarmeViewSet(viewsets.ModelViewSet):
    queryset = AlarmeModel.objects.all()
    
    serializer_class = AlarmeSerializer