from .views import user_views
from django.urls import path

urlpatterns = [
    path('', user_views.exemplo_view, name='view'), # teste
    path("users/", user_views.get_all_users),
    path("users/create/", user_views.create_user),
    path("users/<int:user_id>/", user_views.get_user_by_id),
    path("users/email/", user_views.get_user_by_email),  # GET com ?email=meuemail@x.com
    path("users/<int:user_id>/update/", user_views.update_user),
    path("users/<int:user_id>/delete/", user_views.delete_user),
]
