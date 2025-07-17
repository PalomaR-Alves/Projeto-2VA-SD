import json
from django.http import JsonResponse
from django.http import HttpResponseBadRequest
from django.http import HttpResponseNotAllowed
from django.http import HttpResponse
from django.http import HttpResponseNotFound
from django.views.decorators.csrf import csrf_exempt
from django.views.decorators.http import require_GET
from users_app.controllers import user_controller 


def exemplo_view(request):
    return HttpResponse("USERS tá funcionando!")


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
def get_user_by_id(request, user_id):
    try:
        user = user_controller.get_user_by_id(user_id)

        return JsonResponse({
            "id": user.id,
            "nome": user.nome,
            "email": user.email,
            "telefone": user.telefone,
            "genero": user.genero,
            "is_ativo": user.is_ativo,
            "criado_em": user.criado_em.isoformat(),
        })

    except Exception:
        return HttpResponseNotFound("Usuário não encontrado")


@require_GET
def get_all_users(request):
    alunos = user_controller.get_all_users(tipo="aluno")
    profs = user_controller.get_all_users(tipo="professor")

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

    all_users = [*map(serialize, alunos), *map(serialize, profs)]
    return JsonResponse(all_users, safe=False)


@require_GET
def get_user_by_email(request):
    email = request.GET.get("email")
    if not email:
        return HttpResponseBadRequest("Parâmetro 'email' é obrigatório.")

    try:
        user = user_controller.get_user_by_email(email)

        return JsonResponse({
            "id": user.id,
            "nome": user.nome,
            "email": user.email,
            "telefone": user.telefone,
            "genero": user.genero,
            "is_ativo": user.is_ativo,
            "criado_em": user.criado_em.isoformat(),
        })

    except Exception:
        return HttpResponseNotFound("Usuário não encontrado")


@csrf_exempt
def update_user(request, user_id):
    if request.method not in ["PUT", "PATCH"]:
        return HttpResponseNotAllowed(["PUT", "PATCH"])

    try:
        data = json.loads(request.body)
        user = user_controller.update_user(user_id, **data)

        return JsonResponse({
            "id": user.id,
            "nome": user.nome,
            "email": user.email,
            "telefone": user.telefone,
            "genero": user.genero,
            "is_ativo": user.is_ativo,
            "criado_em": user.criado_em.isoformat(),
        })

    except json.JSONDecodeError:
        return HttpResponseBadRequest("JSON inválido")
    except Exception as e:
        return HttpResponseBadRequest(str(e))


@csrf_exempt
def delete_user(request, user_id):
    if request.method != "DELETE":
        return HttpResponseNotAllowed(["DELETE"])

    try:
        user_controller.delete_user(user_id)
        return JsonResponse({"message": "Usuário deletado com sucesso."}, status=200)

    except Exception:
        return HttpResponseNotFound("Usuário não encontrado")
