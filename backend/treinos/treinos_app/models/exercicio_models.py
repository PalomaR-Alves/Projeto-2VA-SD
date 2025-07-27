from django.db import models

class Exercicio(models.Model):
    nome = models.CharField(max_length=255)
    grupo_muscular = models.CharField(max_length=100)
    equipamento = models.CharField(max_length=100)
    descricao = models.TextField()
    imagem_url = models.URLField(blank=True, null=True)

    professor_id = models.IntegerField()  # ID do professor vindo do users_app

    criado_em = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.nome