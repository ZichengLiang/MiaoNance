import json
from datetime import datetime
from django.http import JsonResponse
from django.shortcuts import render
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.views.decorators.http import require_POST, require_GET
from django.views.decorators.http import require_http_methods
from .services.supabase_client import supabase
from postgrest.exceptions import APIError

@require_GET
def health_check(request):
    """
    Simple site‐health endpoint.
    """
    return JsonResponse({"message": "Miao is alive"})

# WARNING: Bypasses CSRF cookie requirement. For testing purposes only.
@csrf_exempt
@require_POST
def create_notebook(request):
    """
    Create a new Notebook row in Supabase.
    Expects JSON body with:
      - title (str)
      - owner_id (int)
      - (optional) trading_pairs (list or dict)
      - (optional) created_at and last_updated (ISO-8601 strings)
    URL: /api/notebooks/
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

    # Optional Timestamps
    for ts_field in ("created_at", "updated_at"):
        if ts_field in payload:
            try:
                dt = datetime.fromisoformat(payload[ts_field])
                # normalize to full ISO format with offset
                payload[ts_field] = dt.isoformat()
            except ValueError:
                return JsonResponse(
                    {"error": f"Invalid ISO timestamp for {ts_field}"},
                    status=400
                )

    # Build the row data
    row = {
        "title": title,
        "owner_id": owner_id,
        "trading_pairs": trading_pairs,
    }

    # merge in any supplied timestamps
    for ts in ("created_at", "last_updated"):
        if ts in payload:
            row[ts] = payload[ts]

    # Insert into Supabase
    try:
        res = supabase.table("Notebooks").insert(row).execute()
    except APIError as e:
        # e.message contains the PostgREST error details
        return JsonResponse({"error": e.message}, status=400)

    # res.data is a list of inserted rows; take the first
    created = res.data[0]
    return JsonResponse({"notebook": created}, status=201)


# WARNING: Bypasses CSRF cookie requirement. For testing purposes only.
@csrf_exempt
@require_http_methods(["PUT", "PATCH"])
def update_notebook(request, notebook_uuid):
    """
    Fully update a Notebook row. Any of the writable columns in the payload
    (e.g. title, owner_id, trading_pairs) will be applied.
    URL: /api/notebooks/<uuid>/
    """
    # Validate UUID
    try:
        notebook_uuid = str(notebook_uuid)
    except ValueError:
        return JsonResponse({"error": "Invalid notebook UUID"}, status=400)

    # Parse JSON
    try:
        payload = json.loads(request.body)
    except json.JSONDecodeError:
        return JsonResponse({"error": "Invalid JSON"}, status=400)

    # Remove non-writable fields if present
    for forbidden in ("uuid", "created_at"):
        payload.pop(forbidden, None)

    if not payload:
        return JsonResponse(
            {"error": "No updatable fields provided."},
            status=400
        )

    # Validate last_updated if present
    if "last_updated" in payload:
        try:
            # Catch bad formats early
            dt = datetime.fromisoformat(payload["last_updated"])
            # Re-serialize to a full ISO string with offset (+00:00)
            payload["last_updated"] = dt.isoformat()
        except ValueError:
            return JsonResponse(
                {"error": "Invalid ISO timestamp for last_updated"},
                status=400
            )

    # Perform the update
    try:
        res = (
            supabase
            .table("Notebooks")
            .update(payload)
            .eq("uuid", notebook_uuid)
            .execute()
        )
    except APIError as e:
        # catches HTTP errors from Supabase
        return JsonResponse({"error": e.message}, status=400)

    updated = res.data[0]
    return JsonResponse({"notebook": updated}, status=200)
