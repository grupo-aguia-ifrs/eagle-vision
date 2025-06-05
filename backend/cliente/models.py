from django.db import models
import uuid

class ClienteModel(models.Model):
    id  = models.AutoField(primary_key=True)
    nome_fantasia = models.CharField(max_length=255)
    codigo = models.CharField(max_length=255)
    telefone_responsavel = models.CharField(max_length=255)
    nome_responsavel = models.CharField(max_length=255)
    data_cadastro = models.DateField()
    #EXEMPLO DE FOREIGN KEY
    # id_cliente = models.ForeignKey(class para importar,on_delete=models.CASCADE())