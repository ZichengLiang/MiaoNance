from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status, permissions
from django.conf import settings
from django.contrib.auth.models import User
from rest_framework_simplejwt.tokens import RefreshToken, TokenError
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
            # Supabase auth
            auth_response = supabase.auth.sign_in_with_password({
                "email": email,
                "password": password
            })

            user_info = auth_response.user

            if not user_info:
                return Response({"error": "Invalid login credentials"}, status=401)

            # Create a minimal Django user if it doesn't exist
            django_user, created = User.objects.get_or_create(username=email)

            # Issue JWT
            refresh = RefreshToken.for_user(django_user)

            return Response({
                "access": str(refresh.access_token),
                "refresh": str(refresh),
                "user_id": user_info.id,
                "email": email,
            })

        except Exception as e:
            return Response({"error": str(e)}, status=401)

class SupabaseLogoutView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request):
        refresh_token = request.data.get("refresh")

        if not refresh_token:
            return Response({"error": "Refresh token is required."}, status=400)

        try:
            token = RefreshToken(refresh_token)
            token.blacklist() 
            return Response({"message": "Logout successful."}, status=205)

        except TokenError as e:
            return Response({"error": "Invalid or already blacklisted token."}, status=400)
