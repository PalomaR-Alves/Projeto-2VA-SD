import json
from django.http import HttpResponse
from django.http import JsonResponse
from django.http import HttpResponseBadRequest
from django.http import HttpResponseNotAllowed
from django.http import HttpResponseNotFound
from django.views.decorators.csrf import csrf_exempt
from django.views.decorators.http import require_GET
from treinos_app.controllers import treino_controller

def exemplo_view(request):
    return HttpResponse("TREINOS tá funcionando!")


@csrf_exempt
def create_treino(request):
    if request.method != "POST":
        return HttpResponseNotAllowed(["POST"])

    try:
        data = json.loads(request.body)
        treino = treino_controller.create_treino(data)

        return JsonResponse({
            "id": treino.id,
            "aluno_id": treino.aluno_id,
            "professor_id": treino.professor_id,
            "data_inicio": treino.data_inicio.isoformat(),
            "data_fim": treino.data_fim.isoformat(),
            "observacoes": treino.observacoes,
            "criado_em": treino.criado_em.isoformat()
        }, status=201)

    except json.JSONDecodeError:
        return HttpResponseBadRequest("JSON inválido")
    except Exception as e:
        return HttpResponseBadRequest(str(e))


@require_GET
def get_treino_by_id(request, treino_id):
    try:
        treino = treino_controller.get_treino_by_id(treino_id)

        return JsonResponse({
            "id": treino.id,
            "aluno_id": treino.aluno_id,
            "professor_id": treino.professor_id,
            "data_inicio": treino.data_inicio.isoformat(),
            "data_fim": treino.data_fim.isoformat(),
            "observacoes": treino.observacoes,
            "criado_em": treino.criado_em.isoformat()
        })
    except Exception:
        return HttpResponseNotFound("Treino não encontrado")
    

@require_GET
def listar_treinos_aluno(request, aluno_id):
    try:
        treinos = treino_controller.get_treinos_aluno(aluno_id)
        data = [
            {
                "id": treino.id,
                "professor_id": treino.professor_id,
                "data_inicio": treino.data_inicio.isoformat(),
                "data_fim": treino.data_fim.isoformat(),
                "observacoes": treino.observacoes,
            }
            for treino in treinos
        ]
        return JsonResponse({"treinos": data}, status=200)
    except ValueError as e:
        return JsonResponse({"erro": str(e)}, status=400)


@require_GET
def get_all_treinos(request):
    treinos = treino_controller.get_all_treinos()

    data = [{
        "id": t.id,
        "aluno_id": t.aluno_id,
        "professor_id": t.professor_id,
        "data_inicio": t.data_inicio.isoformat(),
        "data_fim": t.data_fim.isoformat(),
        "observacoes": t.observacoes,
        "criado_em": t.criado_em.isoformat()
    } for t in treinos]

    return JsonResponse(data, safe=False)


@csrf_exempt
def update_treino(request, treino_id):
    if request.method not in ["PUT", "PATCH"]:
        return HttpResponseNotAllowed(["PUT", "PATCH"])

    try:
        data = json.loads(request.body)
        treino = treino_controller.update_treino(treino_id, **data)

        return JsonResponse({
            "id": treino.id,
            "aluno_id": treino.aluno_id,
            "professor_id": treino.professor_id,
            "data_inicio": treino.data_inicio.isoformat(),
            "data_fim": treino.data_fim.isoformat(),
            "observacoes": treino.observacoes,
            "criado_em": treino.criado_em.isoformat()
        })

    except json.JSONDecodeError:
        return HttpResponseBadRequest("JSON inválido")
    except Exception as e:
        return HttpResponseBadRequest(str(e))


@csrf_exempt
def delete_treino(request, treino_id):
    if request.method != "DELETE":
        return HttpResponseNotAllowed(["DELETE"])

    try:
        treino_controller.delete_treino(treino_id)
        return JsonResponse({"message": "Treino deletado com sucesso."}, status=200)

    except Exception:
        return HttpResponseNotFound("Treino não encontrado")


@require_GET
def gerar_feedback(request, treino_id):
    try:
        feedback = treino_controller.gerar_feedback(treino_id)
        return JsonResponse({"feedback": feedback})
    except ValueError as e:
        return JsonResponse({"erro": str(e)}, status=400)
    except Exception as e:
        return JsonResponse({"erro": "Erro inesperado ao gerar feedback."}, status=500)