from rest_framework import serializers
from .models import AlarmeModel

class AlarmeSerializer(serializers.ModelSerializer):
    class Meta:
        model = AlarmeModel
        fields = '__all__'