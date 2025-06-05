from django.db import models
from cliente.models import ClienteModel
import uuid

class AlarmeModel(models.Model):
    id  = models.AutoField(primary_key=True)
    id_cliente = models.ForeignKey(ClienteModel, on_delete=models.CASCADE)
    modelo_central = models.CharField(max_length=255)
    sensores_instalados = models.CharField(max_length=255)
    grup_pessoas = models.CharField(max_length=255)
    data_cadastro = models.DateField()
