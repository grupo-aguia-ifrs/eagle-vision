from rest_framework import viewsets
from .models import CFTV
from .serializers import CFTVSerializer

class CFTVViewSet(viewsets.ModelViewSet):
    queryset = CFTV.objects.all()
    serializer_class = CFTVSerializer
