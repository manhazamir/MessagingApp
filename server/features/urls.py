from django.urls import path
from features import views

urlpatterns = [
    path('login/', views.CustomLogin.as_view(), name="login-user"),
    path('signup/', views.CustomRegistration.as_view(), name = "add-user"),
    path('messages/<int:userid>', views.messages_view, name= "view-msgs"),
    path('get-contacts/', views.CustomRegistration.as_view(), name = "get-contacts"),
    path('get-contacts/<int:pk>', views.CustomRegistration.as_view(), name = "put-contacts"),
    path('thread/', views.ThreadView.as_view(), name = "build-connection"),
    path('new-group/', views.NewGroupView.as_view(), name = "new-group"),
    path('get-groups/<int:userfk>', views.NewGroupView.as_view(), name = "get-groups"),
] 
