from treinos_app.models.treino_models import TreinoExercicio
from treinos_app.models.treino_models import Treino
from treinos_app.models.treino_models import Exercicio
from django.core.exceptions import ObjectDoesNotExist

def create_treino_exercicio(data):
    required_fields = ["treino_id", "exercicio_id", "series", "repeticoes", "carga_kg", "ordem_no_dia"]
    for field in required_fields:
        if not data.get(field):
            raise ValueError(f"Campo obrigatório ausente: {field}")

    try:
        treino = Treino.objects.get(id=data["treino_id"])
        exercicio = Exercicio.objects.get(id=data["exercicio_id"])
    except ObjectDoesNotExist:
        raise ValueError("Treino ou Exercício não encontrado")

    return TreinoExercicio.objects.create(
        treino=treino,
        exercicio=exercicio,
        series=data["series"],
        repeticoes=data["repeticoes"],
        carga_kg=data["carga_kg"],
        ordem_no_dia=data["ordem_no_dia"]
    )

def get_treino_exercicio_by_id(te_id):
    try:
        return TreinoExercicio.objects.get(id=te_id)
    except ObjectDoesNotExist:
        raise ValueError("TreinoExercicio não encontrado")

def get_all_treino_exercicios():
    return TreinoExercicio.objects.all()

def update_treino_exercicio(te_id, **data):
    try:
        te = TreinoExercicio.objects.get(id=te_id)
    except ObjectDoesNotExist:
        raise ValueError("TreinoExercicio não encontrado")

    if "treino_id" in data:
        te.treino = Treino.objects.get(id=data["treino_id"])
    if "exercicio_id" in data:
        te.exercicio = Exercicio.objects.get(id=data["exercicio_id"])

    for field in ["series", "repeticoes", "carga_kg", "ordem_no_dia"]:
        if field in data:
            setattr(te, field, data[field])

    te.save()
    return te

def delete_treino_exercicio(te_id):
    try:
        te = TreinoExercicio.objects.get(id=te_id)
        te.delete()
        return True
    except ObjectDoesNotExist:
        raise ValueError("TreinoExercicio não encontrado")
