from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from django.conf import settings
from rest_framework_simplejwt.tokens import RefreshToken
from notebooks.services.supabase_client import supabase

class SupabaseLoginView(APIView):

    # Login with email and password 
    # Returns JWT access and refresh token if correct details entered 


    def post(self, request):
        email = request.data.get("email")
        password = request.data.get("password")

        if not email or not password:
            return Response({"error": "Email and password are required."}, status=400)

        try:
            # Supabase Auth call
            auth_response = supabase.auth.sign_in_with_password({
                "email": email,
                "password": password
            })
            user = auth_response.user

            if not user:
                return Response({"error": "Invalid login."}, status=401)

            # Issue JWT from Django
            refresh = RefreshToken.for_user(user)

            return Response({
                "access": str(refresh.access_token),
                "refresh": str(refresh),
                "user_id": user.id,
                "email": email,
            })

        except Exception as e:
            return Response({"error": str(e)}, status=401)
