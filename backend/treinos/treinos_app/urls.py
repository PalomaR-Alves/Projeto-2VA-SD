from treinos_app.views import treino_views
from treinos_app.views import exercicio_views
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
]
