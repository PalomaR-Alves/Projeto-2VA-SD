import json
import requests
from django.http import HttpResponse
from django.http import JsonResponse
from django.http import HttpResponseBadRequest
from django.http import HttpResponseNotAllowed
from django.http import HttpResponseNotFound
from django.views.decorators.csrf import csrf_exempt
from django.views.decorators.http import require_GET
from treinos_app.controllers import treino_controller
from treinos_app.models.treino_models import Treino, TreinoExercicio

USER_SERVICE_URL = "http://users:8000/users"

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

@csrf_exempt
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
    
@csrf_exempt
@require_GET
def listar_treinos_aluno(request, aluno_id):
    try:
        treinos = treino_controller.get_treinos_aluno(aluno_id)
        data = [
            {
                "id": treino.id,
                "professor_id": treino.professor_id,
                "dia_da_semana": treino.dia_da_semana,  
                "data_inicio": treino.data_inicio.isoformat(),
                "data_fim": treino.data_fim.isoformat(),
                "observacoes": treino.observacoes,
                "criado_em": treino.criado_em.isoformat(),
            }
            for treino in treinos
        ]
        return JsonResponse(data, safe=False, status=200)
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

@csrf_exempt
@require_GET
def gerar_feedback(request, treino_id):
    try:
        feedback = treino_controller.gerar_feedback(treino_id)
        return JsonResponse({"feedback": feedback})
    except ValueError as e:
        return JsonResponse({"erro": str(e)}, status=400)
    except Exception as e:
        return JsonResponse({"erro": "Erro inesperado ao gerar feedback."}, status=500)
    
def treino_detalhado_view(request, treino_id):
    try:
        treino = Treino.objects.get(id=treino_id)
    except Treino.DoesNotExist:
        return HttpResponseNotFound("Treino não encontrado")

    try:
        aluno_res = requests.get(f"{USER_SERVICE_URL}/{treino.aluno_id}/nome/", timeout=3)
        aluno_nome = aluno_res.json().get("nome") if aluno_res.ok else ""
    except:
        aluno_nome = ""

    try:
        prof_res = requests.get(f"{USER_SERVICE_URL}/{treino.professor_id}/nome/", timeout=3)
        professor_nome = prof_res.json().get("nome") if prof_res.ok else ""
    except:
        professor_nome = ""

    exercicios_qs = TreinoExercicio.objects.filter(treino=treino).select_related("exercicio").order_by("ordem_no_dia")

    exercicios_data = [
        {
            "id": te.id,
            "nome": te.exercicio.nome,
            "grupo_muscular": te.exercicio.grupo_muscular,
            "equipamento": te.exercicio.equipamento,
            "series": te.series,
            "repeticoes": te.repeticoes,
            "carga_kg": te.carga_kg,
            "ordem_no_dia": te.ordem_no_dia
        }
        for te in exercicios_qs
    ]

    # Monta resposta completa
    response_data = {
        "id": treino.id,
        "dia_da_semana": treino.dia_da_semana,
        "data_inicio": treino.data_inicio,
        "data_fim": treino.data_fim,
        "observacoes": treino.observacoes,
        "criado_em": treino.criado_em,
        "aluno_id": treino.aluno_id,
        "professor_id": treino.professor_id,
        "aluno_nome": aluno_nome,
        "professor_nome": professor_nome,
        "exercicios": exercicios_data
    }

    return JsonResponse(response_data)
