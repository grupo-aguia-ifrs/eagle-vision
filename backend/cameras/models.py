from django.db import models

class Cliente(models.Model):
    nome = models.CharField(max_length=100)

    def __str__(self):
        return self.nome

class Camera(models.Model):
    cftv = models.ForeignKey(Cliente, on_delete=models.CASCADE)
    modelo_cam = models.CharField(max_length=100)
    ip_cam = models.GenericIPAddressField(blank=True, null=True)
    senha = models.CharField(max_length=100, blank=True, null=True)
    data_cadastro = models.DateField(auto_now_add=True)

    def __str__(self):
        return f"{self.modelo_cam} ({self.ip_cam})"
