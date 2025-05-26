from django.urls import path
from .views import create_notebook, update_notebook, health_check

urlpatterns = [
    path("notebooks/", create_notebook, name="create_notebook"),
    path("notebooks/<uuid:notebook_uuid>/", update_notebook, name="update_notebook"),
    path("health/", health_check, name="health_check"),
]
