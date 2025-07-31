from treinos_app.views import treino_views
from treinos_app.views import exercicio_views
from treinos_app.views import treino_exercicio_views
from django.urls import path

urlpatterns = [
    path("", treino_views.exemplo_view, name='view'), # teste
    path("exercicios/", exercicio_views.get_all_exercicios, name="get_all_exercicios"),
    path("exercicios/create/", exercicio_views.create_exercicio, name="create_exercicio"),
    path("exercicios/<int:exercicio_id>/", exercicio_views.get_exercicio_by_id, name="get_exercicio_by_id"),
    path("exercicios/<int:exercicio_id>/update/", exercicio_views.update_exercicio, name="update_exercicio"),
    path("exercicios/<int:exercicio_id>/delete/", exercicio_views.delete_exercicio, name="delete_exercicio"),
    path("exercicios/nome/<str:exercicio_nome>/", exercicio_views.get_exercicio_by_nome, name="get_exercicio_by_nome"),
    path("treinos/", treino_views.get_all_treinos, name="get_all_treinos"),
    path("treinos/create/", treino_views.create_treino, name="create_treino"),
    path("treinos/<int:treino_id>/", treino_views.get_treino_by_id, name="get_treino_by_id"),
    path("treinos/<int:treino_id>/update/", treino_views.update_treino, name="update_treino"),
    path("treinos/<int:treino_id>/delete/", treino_views.delete_treino, name="delete_treino"),
    path("treinos/<int:treino_id>/feedback/", treino_views.gerar_feedback, name="feedback"),
    path('treinos/aluno/<int:aluno_id>/', treino_views.listar_treinos_aluno),
    path("treino-exercicio/create/", treino_exercicio_views.create_treino_exercicio, name="create_treino_exercicio"),
    path("treino-exercicio/<int:te_id>/", treino_exercicio_views.get_treino_exercicio_by_id, name="get_treino_exercicio_by_id"),
    path("treino-exercicio/", treino_exercicio_views.get_all_treino_exercicios, name="get_all_treino_exercicios"),
    path("treino-exercicio/<int:te_id>/update/", treino_exercicio_views.update_treino_exercicio, name="update_treino_exercicio"),
    path("treino-exercicio/<int:te_id>/delete/", treino_exercicio_views.delete_treino_exercicio, name="delete_treino_exercicio"),
]
