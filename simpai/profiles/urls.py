from django.urls import path
from . import views

urlpatterns = [
    path("list/", views.profile_list_view, name="profile-list"),
    path("<str:username>/", views.profile_detail_view, name="profile-detail"),
]