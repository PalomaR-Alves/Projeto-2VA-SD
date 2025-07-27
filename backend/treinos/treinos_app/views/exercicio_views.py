import json
from django.http import JsonResponse
from django.http import HttpResponseBadRequest
from django.http import HttpResponseNotAllowed
from django.http import HttpResponseNotFound
from django.views.decorators.csrf import csrf_exempt
from django.views.decorators.http import require_GET
from treinos_app.controllers import exercicio_controller


@csrf_exempt
def create_exercicio(request):
    if request.method != "POST":
        return HttpResponseNotAllowed(["POST"])

    try:
        data = json.loads(request.body)
        exercicio = exercicio_controller.create_exercicio(data)

        return JsonResponse({
            "id": exercicio.id,
            "nome": exercicio.nome,
            "grupo_muscular": exercicio.grupo_muscular,
            "equipamento": exercicio.equipamento,
            "descricao": exercicio.descricao,
            "imagem_url": exercicio.imagem_url,
            "professor_id": exercicio.professor_id,
            "criado_em": exercicio.criado_em.isoformat()
        }, status=201)

    except json.JSONDecodeError:
        return HttpResponseBadRequest("JSON inválido")
    except Exception as e:
        return HttpResponseBadRequest(str(e))


@require_GET
def get_exercicio_by_id(request, exercicio_id):
    try:
        exercicio = exercicio_controller.get_exercicio_by_id(exercicio_id)

        return JsonResponse({
            "id": exercicio.id,
            "nome": exercicio.nome,
            "grupo_muscular": exercicio.grupo_muscular,
            "equipamento": exercicio.equipamento,
            "descricao": exercicio.descricao,
            "imagem_url": exercicio.imagem_url,
            "professor_id": exercicio.professor_id,
            "criado_em": exercicio.criado_em.isoformat()
        })
    except Exception:
        return HttpResponseNotFound("Exercício não encontrado")
    
@require_GET
def get_exercicio_by_nome(request):
    nome = request.GET.get("nome")

    # Se nenhum nome for informado, retorna todos
    if not nome:
        exercicios = exercicio_controller.get_all_exercicios()
    else:
        exercicios = exercicio_controller.get_exercicio_by_nome(nome)

    data = [{
        "id": e.id,
        "nome": e.nome,
        "grupo_muscular": e.grupo_muscular,
        "equipamento": e.equipamento,
        "descricao": e.descricao,
        "imagem_url": e.imagem_url,
        "professor_id": e.professor_id,
        "criado_em": e.criado_em.isoformat()
    } for e in exercicios]

    return JsonResponse(data, safe=False)


@require_GET
def get_all_exercicios(request):
    exercicios = exercicio_controller.get_all_exercicios()

    data = [{
        "id": e.id,
        "nome": e.nome,
        "grupo_muscular": e.grupo_muscular,
        "equipamento": e.equipamento,
        "descricao": e.descricao,
        "imagem_url": e.imagem_url,
        "professor_id": e.professor_id,
        "criado_em": e.criado_em.isoformat()
    } for e in exercicios]

    return JsonResponse(data, safe=False)


@csrf_exempt
def update_exercicio(request, exercicio_id):
    if request.method not in ["PUT", "PATCH"]:
        return HttpResponseNotAllowed(["PUT", "PATCH"])

    try:
        data = json.loads(request.body)
        exercicio = exercicio_controller.update_exercicio(exercicio_id, **data)

        return JsonResponse({
            "id": exercicio.id,
            "nome": exercicio.nome,
            "grupo_muscular": exercicio.grupo_muscular,
            "equipamento": exercicio.equipamento,
            "descricao": exercicio.descricao,
            "imagem_url": exercicio.imagem_url,
            "professor_id": exercicio.professor_id,
            "criado_em": exercicio.criado_em.isoformat()
        })

    except json.JSONDecodeError:
        return HttpResponseBadRequest("JSON inválido")
    except Exception as e:
        return HttpResponseBadRequest(str(e))


@csrf_exempt
def delete_exercicio(request, exercicio_id):
    if request.method != "DELETE":
        return HttpResponseNotAllowed(["DELETE"])

    try:
        exercicio_controller.delete_exercicio(exercicio_id)
        return JsonResponse({"message": "Exercício deletado com sucesso."}, status=200)

    except Exception:
        return HttpResponseNotFound("Exercício não encontrado")
