from treinos_app.views import treino_views

from django.urls import path

urlpatterns = [
    path('', treino_views.exemplo_view, name='view'), # teste

]
