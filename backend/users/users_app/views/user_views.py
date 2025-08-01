import json
from django.http import JsonResponse
from django.http import HttpResponseBadRequest
from django.http import HttpResponseNotAllowed
from django.http import HttpResponse
from django.http import HttpResponseNotFound
from django.views.decorators.csrf import csrf_exempt
from django.views.decorators.http import require_GET, require_POST
from users_app.controllers import user_controller
from users_app.models.user_models import Professor
from users_app.models.user_models import Aluno
from django.contrib.auth import get_user_model
from django.contrib.auth import login, logout
from django.views.decorators.http import require_http_methods
import traceback
from functools import wraps


def exemplo_view(request):
    return HttpResponse("USERS tá funcionando!")

def login_required_api(view_func):
    @wraps(view_func)
    def _wrapped_view(request, *args, **kwargs):
        if not request.user.is_authenticated:
            return JsonResponse({"erro": "Usuário não autenticado."}, status=401)
        return view_func(request, *args, **kwargs)
    return _wrapped_view

User = get_user_model()
@csrf_exempt
@require_POST
def login_user(request):
    try:
        data = json.loads(request.body)
        email = data.get("email")
        senha = data.get("senha")

        if not email or not senha:
            return HttpResponseBadRequest("Email e senha são obrigatórios.")

        user = user_controller.autenticar_user(email, senha)

        if user is None:
            return HttpResponseNotFound("Credenciais inválidas.")

        if not user.is_active:
            return HttpResponseBadRequest("Usuário desativado.")

        login(request, user)

        tipo = "aluno" if hasattr(user, "aluno") else "professor"
        return JsonResponse({
            "id": user.id,
            "nome": user.nome,
            "email": user.email,
            "tipo": tipo
        })

    except json.JSONDecodeError:
        return HttpResponseBadRequest("JSON inválido.")
    except Exception as e:
        return HttpResponseBadRequest(str(e))


@csrf_exempt
@require_POST
def logout_user(request):
    logout(request)
    return JsonResponse({"message": "Logout realizado com sucesso."})


@require_GET
def get_tipo_usuario(request, user_id):
    try:
        tipo = user_controller.get_tipo_usuario(user_id)

        if tipo:
            return JsonResponse({"tipo": tipo})
        else:
            return HttpResponseNotFound("Usuário não encontrado")

    except Exception:
        return HttpResponseNotFound("Erro ao buscar usuário")
    
@require_GET
def get_nome_usuario(request, user_id):
    try:
        nome = user_controller.get_nome_usuario(user_id)

        if nome:
            return JsonResponse({"nome": nome})
        else:
            return HttpResponseNotFound("Usuário não encontrado")

    except Exception:
        return HttpResponseNotFound("Erro ao buscar usuário")
    
@require_GET
def get_objetivo_aluno(request, user_id):
    try:
        obj = user_controller.get_objetivo_aluno(user_id)

        if obj:
            return JsonResponse({"objetivo": obj})
        else:
            return HttpResponseNotFound("Aluno não encontrado")

    except Exception:
        return HttpResponseNotFound("Erro ao buscar aluno")
    

@csrf_exempt
def create_user(request):
    if request.method != "POST":
        return HttpResponseNotAllowed(["POST"])

    try:
        data = json.loads(request.body)
        user = user_controller.create_user(data)

        return JsonResponse(
            {
                "id": user.id,
                "nome": user.nome,
                "email": user.email,
                "telefone": user.telefone,
                "genero": user.genero,
                "is_ativo": user.is_ativo,
                "criado_em": user.criado_em.isoformat(),
            },
            status=201,
        )

    except json.JSONDecodeError:
        return HttpResponseBadRequest("JSON inválido")
    except Exception as e:
        return HttpResponseBadRequest(str(e))


@require_GET
@csrf_exempt
def get_user_by_id(request, user_id):
    try:
        user = user_controller.get_user_by_id(user_id)

        base = {
            "id": user.id,
            "nome": user.nome,
            "email": user.email,
            "telefone": user.telefone,
            "genero": user.genero,
            "is_ativo": user.is_ativo,
            "criado_em": user.criado_em.isoformat(),
        }

        if isinstance(user, Aluno):
            base.update({
                "tipo": "aluno",
                "data_nasc": user.data_nasc.isoformat(),
                "objetivo": user.objetivo,
                "altura_cm": user.altura_cm,
                "peso_kg": user.peso_kg,
            })
        elif isinstance(user, Professor):
            base.update({
                "tipo": "professor",
                "cref": user.cref,
                "bio_profissional": user.bio_profissional,
                "data_admissao": user.data_admissao.isoformat() if user.data_admissao else None,
                "data_saida": user.data_saida.isoformat() if user.data_saida else None,
            })

        return JsonResponse(base)

    except Exception as e:
        return HttpResponseNotFound(f"Usuário não encontrado: {str(e)}")


@require_GET
def get_all_users(request):
    tipo = request.GET.get("tipo")  # aluno, professor ou None

    try:
        users = user_controller.get_all_users(tipo=tipo)

        def serialize(user):
            return {
                "id": user.id,
                "nome": user.nome,
                "email": user.email,
                "telefone": user.telefone,
                "genero": user.genero,
                "is_ativo": user.is_ativo,
                "criado_em": user.criado_em.isoformat(),
            }

        return JsonResponse([serialize(u) for u in users], safe=False)

    except ValueError as e:
        return HttpResponseBadRequest(str(e))


@require_GET
def get_user_by_email(request):
    email = request.GET.get("email")
    if not email:
        return HttpResponseBadRequest("Parâmetro 'email' é obrigatório.")

    try:
        user = user_controller.get_user_by_email(email)

        base = {
            "id": user.id,
            "nome": user.nome,
            "email": user.email,
            "telefone": user.telefone,
            "genero": user.genero,
            "is_ativo": user.is_ativo,
            "criado_em": user.criado_em.isoformat(),
        }

        if isinstance(user, Aluno):
            base.update({
                "tipo": "aluno",
                "data_nasc": user.data_nasc.isoformat(),
                "objetivo": user.objetivo,
                "altura_cm": user.altura_cm,
                "peso_kg": user.peso_kg,
            })
        elif isinstance(user, Professor):
            base.update({
                "tipo": "professor",
                "cref": user.cref,
                "bio_profissional": user.bio_profissional,
                "data_admissao": user.data_admissao.isoformat() if user.data_admissao else None,
                "data_saida": user.data_saida.isoformat() if user.data_saida else None,
            })


        return JsonResponse(base)

    except Exception as e:
        return HttpResponseNotFound(f"Erro ao buscar usuário por email: {str(e)}")



@csrf_exempt
@require_http_methods(["PUT", "PATCH"])
def update_user(request, user_id):
    if request.method == "OPTIONS":
        return HttpResponse()

    try:
        data = json.loads(request.body)
        user = user_controller.update_user(user_id, **data)

        is_professor = hasattr(user, "cref")

        response = {
            "id": user.id,
            "nome": user.nome,
            "email": user.email,
            "telefone": user.telefone,
            "genero": user.genero,
            "is_ativo": user.is_ativo,
            "criado_em": user.criado_em.isoformat(),
            "tipo": "professor" if is_professor else "aluno",
        }

        if is_professor:
            response.update({
                "cref": user.cref,
                "bio_profissional": user.bio_profissional,
            })
        else:
            response.update({
                "data_nasc": user.data_nasc,
                "objetivo": user.objetivo,
                "altura_cm": user.altura_cm,
                "peso_kg": user.peso_kg,
            })

        return JsonResponse(response, status=200)

    except json.JSONDecodeError:
        return HttpResponseBadRequest("JSON inválido")
    
    except Exception as e:
        # LOGAR o erro no console do servidor para depurar depois
        print("Erro interno no update_user:", str(e))
        traceback.print_exc()
        return HttpResponse(status=204) 

@csrf_exempt
def delete_user(request, user_id):
    if request.method != "DELETE":
        return HttpResponseNotAllowed(["DELETE"])

    try:
        user_controller.delete_user(user_id)
        return JsonResponse({"message": "Usuário deletado com sucesso."}, status=200)

    except Exception:
        return HttpResponseNotFound("Usuário não encontrado")
