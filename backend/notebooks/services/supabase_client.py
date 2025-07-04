from supabase import create_client
from django.conf import settings

# Re-use this line for every view
supabase = create_client(settings.SUPABASE_URL, settings.SUPABASE_KEY)
