import json
from django.http import JsonResponse
from django.http import HttpResponseBadRequest
from django.http import HttpResponseNotAllowed
from django.http import HttpResponseNotFound
from django.views.decorators.csrf import csrf_exempt
from django.views.decorators.http import require_GET
from treinos_app.controllers import treino_exercicio_controller

@csrf_exempt
def create_treino_exercicio(request):
    if request.method != "POST":
        return HttpResponseNotAllowed(["POST"])

    try:
        data = json.loads(request.body)
        te = treino_exercicio_controller.create_treino_exercicio(data)

        return JsonResponse({
            "id": te.id,
            "treino_id": te.treino.id,
            "exercicio_id": te.exercicio.id,
            "dia_da_semana": te.dia_da_semana,
            "series": te.series,
            "repeticoes": te.repeticoes,
            "carga_kg": te.carga_kg,
            "ordem_no_dia": te.ordem_no_dia,
        }, status=201)

    except json.JSONDecodeError:
        return HttpResponseBadRequest("JSON inválido")
    except Exception as e:
        return HttpResponseBadRequest(str(e))


@require_GET
def get_treino_exercicio_by_id(request, te_id):
    try:
        te = treino_exercicio_controller.get_treino_exercicio_by_id(te_id)

        return JsonResponse({
            "id": te.id,
            "treino_id": te.treino.id,
            "exercicio_id": te.exercicio.id,
            "dia_da_semana": te.dia_da_semana,
            "series": te.series,
            "repeticoes": te.repeticoes,
            "carga_kg": te.carga_kg,
            "ordem_no_dia": te.ordem_no_dia,
        })
    except Exception:
        return HttpResponseNotFound("TreinoExercicio não encontrado")


@require_GET
def get_all_treino_exercicios(request):
    tes = treino_exercicio_controller.get_all_treino_exercicios()

    data = [{
        "id": te.id,
        "treino_id": te.treino.id,
        "exercicio_id": te.exercicio.id,
        "dia_da_semana": te.dia_da_semana,
        "series": te.series,
        "repeticoes": te.repeticoes,
        "carga_kg": te.carga_kg,
        "ordem_no_dia": te.ordem_no_dia,
    } for te in tes]

    return JsonResponse(data, safe=False)


@csrf_exempt
def update_treino_exercicio(request, te_id):
    if request.method not in ["PUT", "PATCH"]:
        return HttpResponseNotAllowed(["PUT", "PATCH"])

    try:
        data = json.loads(request.body)
        te = treino_exercicio_controller.update_treino_exercicio(te_id, **data)

        return JsonResponse({
            "id": te.id,
            "treino_id": te.treino.id,
            "exercicio_id": te.exercicio.id,
            "dia_da_semana": te.dia_da_semana,
            "series": te.series,
            "repeticoes": te.repeticoes,
            "carga_kg": te.carga_kg,
            "ordem_no_dia": te.ordem_no_dia,
        })

    except json.JSONDecodeError:
        return HttpResponseBadRequest("JSON inválido")
    except Exception as e:
        return HttpResponseBadRequest(str(e))


@csrf_exempt
def delete_treino_exercicio(request, te_id):
    if request.method != "DELETE":
        return HttpResponseNotAllowed(["DELETE"])

    try:
        treino_exercicio_controller.delete_treino_exercicio(te_id)
        return JsonResponse({"message": "TreinoExercicio deletado com sucesso."}, status=200)

    except Exception:
        return HttpResponseNotFound("TreinoExercicio não encontrado")
