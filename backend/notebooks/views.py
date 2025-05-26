import json
from django.shortcuts import render
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.views.decorators.http import require_POST
from .services.supabase_client import supabase
from postgrest.exceptions import APIError

# WARNING: Bypasses CSRF cookie requirement. For testing purposes only.
@csrf_exempt
@require_POST
def create_notebook(request):
    """
    Create a new Notebook row in Supabase.
    Expects JSON body with: title (str), owner_id (int), trading_pairs (list/dict).
    """
    try:
        payload = json.loads(request.body)
    except json.JSONDecodeError:
        return JsonResponse({"error": "Invalid JSON"}, status=400)

    title = payload.get("title")
    owner_id = payload.get("owner_id")
    trading_pairs = payload.get("trading_pairs", [])

    if not title or owner_id is None:
        return JsonResponse (
            {"error": "Missing required fields: title and owner_id"},
            status=400
        )

    # Build the row data
    row = {
        "title": title,
        "owner_id": owner_id,
        "trading_pairs": trading_pairs,
    }

    # Insert into Supabase
    try:
        res = supabase.table("Notebooks").insert(row).execute()
    except APIError as e:
        # e.message contains the PostgREST error details
        return JsonResponse({"error": e.message}, status=400)

    # res.data is a list of inserted rows; take the first
    created = res.data[0]
    return JsonResponse({"notebook": created}, status=201)
