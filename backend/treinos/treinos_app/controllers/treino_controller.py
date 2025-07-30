from treinos_app.models.treino_models import Treino
from django.core.exceptions import ObjectDoesNotExist
from dotenv import load_dotenv
from google import genai
from datetime import datetime
import requests
import os

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
    
def get_nome_usuario(user_id):
    try:
        response = requests.get(f"{USER_SERVICE_URL}/{user_id}/nome/", timeout=3)
        if response.status_code == 200:
            return response.json().get("nome")
        return None
    except requests.RequestException:
        return None
    
def get_objetivo_aluno(user_id):
    try:
        response = requests.get(f"{USER_SERVICE_URL}/{user_id}/objetivo/", timeout=3)
        if response.status_code == 200:
            return response.json().get("objetivo")
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

            # conversão de string para date se preciso
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


def gerar_feedback(treino_id):
    try:
        treino = Treino.objects.get(id=treino_id)
        exercicios = treino.exercicios.select_related("exercicio").all()

        if not exercicios:
            raise ValueError("Treino não possui exercícios cadastrados.")
        
        aluno = get_nome_usuario(treino.aluno_id)
        objetivo = get_objetivo_aluno(treino.aluno_id)

        # prompt pro gemini
        prompt = f"""
        Gere uma mensagem motivacional e explicativa para o aluno {aluno}, o qual 
        possui como objetivo {objetivo}. A mensagem é para mantê-lo(a) engajado no
        treino, explicando brevemente o por que ele deve fazer cada exercício e no que
        irá ajudá-lo, incentivando seu progresso.

        Duração do treino: de {treino.data_inicio} até {treino.data_fim}.
        Lista de exercícios:
        """

        for ex in exercicios:
            prompt += f"\n- {ex.exercicio.nome} ({ex.series}x{ex.repeticoes} rep com {ex.carga_kg}kg)"

        prompt += "\n\nA mensagem deve ser positiva, mas CURTA e direta. Não escreva mais que 170 palavras"

        # chamada da API
        dotenv_path = os.path.join(os.path.dirname(__file__), '..', '..', '.env', '.gemini_api_key')
        load_dotenv(dotenv_path=dotenv_path)
        GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")

        client = genai.Client(api_key=GEMINI_API_KEY)

        response = client.models.generate_content(
            model="gemini-2.5-flash",
            contents=prompt,
        )
        
        feedback = response.text.strip() if response.text else "Feedback não gerado."

        return feedback

    except Treino.DoesNotExist:
        raise ValueError("Treino não encontrado")
    except Exception as e:
        raise ValueError(f"Erro ao gerar feedback: {str(e)}")