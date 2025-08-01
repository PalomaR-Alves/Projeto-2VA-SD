from django.contrib.auth.hashers import make_password
from django.contrib.auth.hashers import check_password
from django.core.exceptions import ValidationError
from django.core.validators import validate_email
from users_app.models.user_models import Aluno, Professor
from django.contrib.auth import authenticate
from users_app.models.user_models import User
from django.utils import timezone

def autenticar_user(email, senha):
    try:
        user = User.objects.get(email=email)
        if check_password(senha, user.senha):
            return user
    except User.DoesNotExist:
        return None

def get_tipo_usuario(user_id):
    if Professor.objects.filter(id=user_id).exists():
        return "professor"
    elif Aluno.objects.filter(id=user_id).exists():
        return "aluno"
    else:
        return None


def get_nome_usuario(user_id):
    prof = Professor.objects.filter(id=user_id).first()
    if prof:
        return prof.nome

    al = Aluno.objects.filter(id=user_id).first()
    if al:
        return al.nome
    return None

def get_objetivo_aluno(user_id):
    al = Aluno.objects.filter(id=user_id).first()
    if al:
        return al.objetivo
    return "Aluno não encontrado"


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
        required = ["cref", "bio_profissional"]
        for field in required:
            if not data.get(field):
                raise ValueError(f"Campo obrigatório ausente: {field}")

        return Professor.objects.create(
            **common_fields,
            cref=data["cref"],
            bio_profissional=data["bio_profissional"],
            data_admissao=timezone.now()
        )


def get_user_by_email(email):
    email = email.strip().lower()

    aluno = Aluno.objects.filter(email__iexact=email).first()
    if aluno:
        return aluno

    professor = Professor.objects.filter(email__iexact=email).first()
    if professor:
        return professor

    raise ValueError("Usuário não encontrado")


def get_user_by_id(user_id):
    print(f"Buscando usuário ID {user_id}")

    aluno = Aluno.objects.filter(id=user_id).first()
    print("Aluno encontrado?", aluno)

    if aluno:
        return aluno

    professor = Professor.objects.filter(id=user_id).first()
    print("Professor encontrado?", professor)

    if professor:
        return professor

    raise ValueError("Usuário não encontrado")
        

def get_all_users(tipo=None):
    if tipo == "aluno":
        return Aluno.objects.all()
    elif tipo == "professor":
        return Professor.objects.all()
    elif tipo is None:
        return list(Aluno.objects.all()) + list(Professor.objects.all())
    else:
        raise ValueError("Tipo inválido. Use 'aluno', 'professor' ou deixe em branco para retornar todos.")

        
def update_user(user_id, **data):
    user = None
    tipo = None

    # aluno ou professor
    try:
        user = Aluno.objects.get(id=user_id)
        tipo = "aluno"
    except Aluno.DoesNotExist:
        try:
            user = Professor.objects.get(id=user_id)
            tipo = "professor"
        except Professor.DoesNotExist:
            raise ValueError("Usuário não encontrado.")

    campos_comuns = ["nome", "email", "telefone", "genero", "is_ativo"]
    for campo in campos_comuns:
        if campo in data:
            setattr(user, campo, data[campo])

    # validação de email
    if "email" in data and data["email"] != user.email:
        try:
            validate_email(data["email"])
        except ValidationError:
            raise ValueError("Formato de email inválido.")

        # verificação de duplicidade
        if Aluno.objects.filter(email=data["email"]).exclude(id=user.id).exists() or \
           Professor.objects.filter(email=data["email"]).exclude(id=user.id).exists():
            raise ValueError("Este email já está cadastrado por outro usuário.")

    if tipo == "aluno":
        campos_especificos = ["data_nasc", "objetivo", "altura_cm", "peso_kg"]
    else:  # professor
        campos_especificos = ["cref", "bio_profissional", "data_admissao", "data_saida"]

    for campo in campos_especificos:
        if campo in data:
            setattr(user, campo, data[campo])

    user.save()
    return user


def delete_user(user_id):
    for Model in [Aluno, Professor]:
        try:
            user = Model.objects.get(id=user_id)
            user.delete()
            return True
        except Model.DoesNotExist:
            continue
    raise ValueError("Usuário não encontrado")
