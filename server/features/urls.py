from django.urls import path
from features import views


urlpatterns = [
    path('login/', views.CustomLogin.as_view(), name="login-user"),
    path('signup/', views.CustomRegistration.as_view(), name = "add-user"),
    path('get-contacts/', views.CustomRegistration.as_view(), name = "get-contacts"),
    path('get-contacts/<int:pk>', views.CustomRegistration.as_view(), name = "put-contacts"),
    path('thread/', views.ThreadView.as_view(), name = "build-connection"),

] 
