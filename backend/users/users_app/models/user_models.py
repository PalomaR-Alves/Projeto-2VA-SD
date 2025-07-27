from django.contrib.auth.models import AbstractUser
from django.db import models

class User(AbstractUser):
    username = None  # Remove o campo padrão

    nome = models.CharField(max_length=255, default="")
    email = models.EmailField(unique=True)
    senha = models.CharField(max_length=255, default="")
    telefone = models.CharField(max_length=20)
    genero = models.CharField(
        max_length=10,
        choices=[("masculino", "Masculino"), ("feminino", "Feminino"), ("outros", "Outros")]
    )
    is_ativo = models.BooleanField(default=True)
    criado_em = models.DateTimeField(auto_now_add=True)

    USERNAME_FIELD = "email"
    REQUIRED_FIELDS = ["nome"]

    class Meta:
        verbose_name = "Usuário"
        verbose_name_plural = "Usuários"

    def __str__(self):
        return self.email


class Aluno(User):
    data_nasc = models.DateField()
    objetivo = models.CharField(max_length=255, blank=True, default="")
    altura_cm = models.IntegerField()
    peso_kg = models.FloatField()

    class Meta:
        verbose_name = "Aluno"
        verbose_name_plural = "Alunos"


class Professor(User):
    cref = models.CharField(max_length=20)
    bio_profissional = models.TextField()
    data_admissao = models.DateField()
    data_saida = models.DateField(null=True, blank=True)

    class Meta:
        verbose_name = "Professor"
        verbose_name_plural = "Professores"
