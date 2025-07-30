from .views import user_views
from django.urls import path

urlpatterns = [
    path('', user_views.exemplo_view, name='view'),  # teste
    path("users/", user_views.get_all_users),
    path("users/create/", user_views.create_user),
    path("users/<int:user_id>/update/", user_views.update_user),
    path("users/<int:user_id>/delete/", user_views.delete_user),
    path("users/<int:user_id>/tipo/", user_views.get_tipo_usuario),
    path("users/<int:user_id>/nome/", user_views.get_nome_usuario),
    path("users/<int:user_id>/objetivo/", user_views.get_objetivo_aluno),
    path("users/email/", user_views.get_user_by_email),
    path("users/<int:user_id>/", user_views.get_user_by_id),
]