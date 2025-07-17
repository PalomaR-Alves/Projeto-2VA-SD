from django.contrib.auth.hashers import make_password
from django.core.exceptions import ValidationError
from django.core.exceptions import ObjectDoesNotExist
from django.core.validators import validate_email
from users_app.models.user_models import Aluno, Professor


def create_user(data):
    tipo = data.get("tipo")  # "aluno" ou "professor"
    if tipo not in ["aluno", "professor"]:
        raise ValueError("Campo 'tipo' deve ser 'aluno' ou 'professor'.")

    email = data.get("email")
    senha = data.get("senha")

    try:
        validate_email(email)
    except ValidationError:
        raise ValueError("Formato de email inválido.")

    if Aluno.objects.filter(email=email).exists() or Professor.objects.filter(email=email).exists():
        raise ValueError("Este email já está cadastrado.")

    common_fields = {
        "nome": data.get("nome"),
        "email": email,
        "senha": make_password(senha),
        "telefone": data.get("telefone"),
        "genero": data.get("genero"),
        "is_ativo": data.get("is_ativo", True),
    }

    if tipo == "aluno":
        required = ["data_nasc", "altura_cm", "peso_kg"]
        for field in required:
            if not data.get(field):
                raise ValueError(f"Campo obrigatório ausente: {field}")

        return Aluno.objects.create(
            **common_fields,
            data_nasc=data["data_nasc"],
            objetivo=data.get("objetivo", ""),
            altura_cm=data["altura_cm"],
            peso_kg=data["peso_kg"],
        )

    if tipo == "professor":
        required = ["cref", "bio_profissional", "data_admissao", "data_saida"]
        for field in required:
            if not data.get(field):
                raise ValueError(f"Campo obrigatório ausente: {field}")

        return Professor.objects.create(
            **common_fields,
            cref=data["cref"],
            bio_profissional=data["bio_profissional"],
            data_admissao=data["data_admissao"],
            data_saida=data["data_saida"],
        )


def get_user_by_email(email):
    try:
        return Aluno.objects.get(email=email)
    except Aluno.DoesNotExist:
        try:
            return Professor.objects.get(email=email)
        except Professor.DoesNotExist:
            raise ValueError("Usuário não encontrado")


def get_user_by_id(user_id):
    try:
        return Aluno.objects.get(id=user_id)
    except Aluno.DoesNotExist:
        try:
            return Professor.objects.get(id=user_id)
        except Professor.DoesNotExist:
            raise ValueError("Usuário não encontrado")


def delete_user(user_id):
    for Model in [Aluno, Professor]:
        try:
            user = Model.objects.get(id=user_id)
            user.delete()
            return True
        except Model.DoesNotExist:
            continue
    raise ValueError("Usuário não encontrado")
