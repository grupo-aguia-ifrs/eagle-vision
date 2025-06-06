from rest_framework import serializers
from .models import CFTV

class CFTVSerializer(serializers.ModelSerializer):
    class Meta:
        model = CFTV
        fields = '__all__'
