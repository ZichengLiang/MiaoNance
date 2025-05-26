from django.urls import path
from .views import create_notebook

urlpatterns = [
    path("notebooks/", create_notebook, name="create_notebook"),
]
