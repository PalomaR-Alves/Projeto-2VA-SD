from treinos_app.models.treino_models import Treino
from django.core.exceptions import ObjectDoesNotExist
from datetime import datetime
import requests

USER_SERVICE_URL = "http://users:8000/users"

def verificar_usuario(user_id):
    try:
        response = requests.get(f"{USER_SERVICE_URL}/{user_id}/", timeout=3)
        return response.status_code == 200
    except requests.RequestException:
        return False
    

def get_tipo_usuario(user_id):
    try:
        response = requests.get(f"{USER_SERVICE_URL}/{user_id}/tipo/", timeout=3)
        if response.status_code == 200:
            return response.json().get("tipo")
        return None
    except requests.RequestException:
        return None


def create_treino(data):
    required_fields = ["aluno_id", "professor_id", "data_inicio", "data_fim"]
    for field in required_fields:
        if not data.get(field):
            raise ValueError(f"Campo obrigatório ausente: {field}")

    tipo_aluno = get_tipo_usuario(data["aluno_id"])
    tipo_prof = get_tipo_usuario(data["professor_id"])

    if tipo_aluno != "aluno":
        raise ValueError("aluno_id inválido (não é um aluno)")
    if tipo_prof != "professor":
        raise ValueError("professor_id inválido (somente professores podem criar treinos)")

    # converte string
    data_inicio = datetime.fromisoformat(data["data_inicio"]).date()
    data_fim = datetime.fromisoformat(data["data_fim"]).date()

    return Treino.objects.create(
        aluno_id=data["aluno_id"],
        professor_id=data["professor_id"],
        data_inicio=data_inicio,
        data_fim=data_fim,
        observacoes=data.get("observacoes", "")
    )


def get_treino_by_id(treino_id):
    try:
        return Treino.objects.get(id=treino_id)
    except ObjectDoesNotExist:
        raise ValueError("Treino não encontrado")

def get_all_treinos():
    return Treino.objects.all()

def update_treino(treino_id, **data):
    try:
        treino = Treino.objects.get(id=treino_id)
    except ObjectDoesNotExist:
        raise ValueError("Treino não encontrado")

    if "aluno_id" in data:
        if not verificar_usuario(data["aluno_id"]):
            raise ValueError("Aluno não encontrado")

        tipo_aluno = get_tipo_usuario(data["aluno_id"])
        if tipo_aluno != "aluno":
            raise ValueError("aluno_id inválido (não é um aluno)")

    if "professor_id" in data:
        if not verificar_usuario(data["professor_id"]):
            raise ValueError("Professor não encontrado")

        tipo_prof = get_tipo_usuario(data["professor_id"])
        if tipo_prof != "professor":
            raise ValueError("professor_id inválido (somente professores podem modificar treinos)")

    for field in ["aluno_id", "professor_id", "data_inicio", "data_fim", "observacoes"]:
        if field in data:
            value = data[field]

            # 🔽 Conversão de string para date, se necessário
            if field in ["data_inicio", "data_fim"] and isinstance(value, str):
                value = datetime.fromisoformat(value).date()

            setattr(treino, field, value)

    treino.save()
    return treino

def delete_treino(treino_id):
    try:
        treino = Treino.objects.get(id=treino_id)
        treino.delete()
        return True
    except ObjectDoesNotExist:
        raise ValueError("Treino não encontrado")
