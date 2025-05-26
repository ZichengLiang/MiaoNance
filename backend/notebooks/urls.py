from django.urls import path
from .views import create_notebook, update_notebook

urlpatterns = [
    path("notebooks/", create_notebook, name="create_notebook"),
    path("notebooks/<uuid:notebook_uuid>/", update_notebook, name="update_notebook"),
]
