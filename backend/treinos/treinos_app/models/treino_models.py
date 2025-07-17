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


class Treino(models.Model):
    aluno_id = models.IntegerField()      # ID do aluno no users_app
    professor_id = models.IntegerField()  # ID do professor no users_app

    data_inicio = models.DateField()
    data_fim = models.DateField()
    observacoes = models.TextField(blank=True)

    criado_em = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Treino ({self.aluno_id}) de {self.data_inicio} a {self.data_fim}"


class TreinoExercicio(models.Model):
    DIAS_SEMANA = [
        ("segunda", "Segunda-feira"),
        ("terca", "Terça-feira"),
        ("quarta", "Quarta-feira"),
        ("quinta", "Quinta-feira"),
        ("sexta", "Sexta-feira"),
        ("sabado", "Sábado"),
        ("domingo", "Domingo"),
    ]

    treino = models.ForeignKey(Treino, on_delete=models.CASCADE, related_name="exercicios")
    exercicio = models.ForeignKey(Exercicio, on_delete=models.CASCADE)

    dia_da_semana = models.CharField(max_length=10, choices=DIAS_SEMANA)
    series = models.IntegerField()
    repeticoes = models.IntegerField()
    carga_kg = models.FloatField()
    ordem_no_dia = models.IntegerField()

    def __str__(self):
        return f"{self.exercicio.nome} ({self.dia_da_semana})"
