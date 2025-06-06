from django.db import models

# Create your models here.

class CFTV(models.Model):
    cliente = models.ForeignKey('cliente.ClienteModel', on_delete=models.CASCADE)
    modelo_cftv = models.CharField(max_length=100)
    ip_externo = models.CharField(max_length=100)
    cloud_cftv = models.CharField(max_length=100)
    grup_pessoas = models.CharField(max_length=100)
    data_cadastro = models.DateField()

   
