from treinos_app.models.exercicio_models import Exercicio
from django.core.exceptions import ObjectDoesNotExist
from django.db.models import Q
import requests

USER_SERVICE_URL = "http://users:8000/users"

def verificar_professor(professor_id):
    try:
        response = requests.get(f"{USER_SERVICE_URL}/{professor_id}/", timeout=3)
        return response.status_code == 200
    except requests.RequestException:
        return False

def create_exercicio(data):
    required_fields = ["nome", "grupo_muscular", "equipamento", "descricao", "professor_id"]
    for field in required_fields:
        if not data.get(field):
            raise ValueError(f"Campo obrigatório ausente: {field}")

    if not verificar_professor(data["professor_id"]):
        raise ValueError("Professor não encontrado no serviço de usuários.")

    return Exercicio.objects.create(
        nome=data["nome"],
        grupo_muscular=data["grupo_muscular"],
        equipamento=data["equipamento"],
        descricao=data["descricao"],
        imagem_url=data.get("imagem_url"),
        professor_id=data["professor_id"],
    )


def get_exercicio_by_id(exercicio_id):
    try:
        return Exercicio.objects.get(id=exercicio_id)
    except ObjectDoesNotExist:
        raise ValueError("Exercício não encontrado")


def get_exercicio_by_nome(nome):
    if not nome:
        raise ValueError("Nenhum nome fornecido.")
    
    return Exercicio.objects.filter(nome__icontains=nome)


def get_all_exercicios():
    return Exercicio.objects.all()


def update_exercicio(exercicio_id, **data):
    try:
        exercicio = Exercicio.objects.get(id=exercicio_id)
    except ObjectDoesNotExist:
        raise ValueError("Exercício não encontrado")

    if "professor_id" in data:
        if not verificar_professor(data["professor_id"]):
            raise ValueError("Professor não encontrado no serviço de usuários.")

    for field in ["nome", "grupo_muscular", "equipamento", "descricao", "imagem_url", "professor_id"]:
        if field in data:
            setattr(exercicio, field, data[field])

    exercicio.save()
    return exercicio


def delete_exercicio(exercicio_id):
    try:
        exercicio = Exercicio.objects.get(id=exercicio_id)
        exercicio.delete()
        return True
    except ObjectDoesNotExist:
        raise ValueError("Exercício não encontrado")
