import json
import requests
from datetime import datetime
from django.http import JsonResponse, Http404
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
    1) Insert a new row into Notebook.
    2) If the client sent "trading_pairs": ["BTC/USDT", "ETH/EUR", ...],
       look up each string in TradingPairs to get its ID, then bulk-insert
       into Notebook_TradingPairs.
    URL: POST /api/notebooks/
    Body JSON:
    {
      "title": "My Notebook",
      "owner_id": "<uuid>",
      "trading_pairs": ["BTC/USDT", "ETH/BTC"],
      "created_at": "...",       # optional
      "last_updated": "..."      # optional
    }
    """
    try:
        payload = json.loads(request.body)
    except json.JSONDecodeError:
        return JsonResponse({"error": "Invalid JSON"}, status=400)

    title = payload.get("title")
    owner_id = payload.get("owner_id")
    pair_strings = payload.get("trading_pairs", [])  # now strings, not IDs

    if not title or owner_id is None:
        return JsonResponse(
            {"error": "Missing required fields: title and owner_id"},
            status=400
        )

    # 1a) Optional timestamps on Notebooks
    for ts_field in ("created_at", "last_updated"):
        if ts_field in payload:
            try:
                dt = datetime.fromisoformat(payload[ts_field])
                payload[ts_field] = dt.isoformat()
            except ValueError:
                return JsonResponse(
                    {"error": f"Invalid ISO timestamp for {ts_field}"},
                    status=400
                )

    # 1b) Insert into Notebooks table
    notebook_row = {
        "title": title,
        "owner_id": owner_id,
    }
    for ts in ("created_at", "last_updated"):
        if ts in payload:
            notebook_row[ts] = payload[ts]

    try:
        nb_res = supabase.table("Notebook").insert(notebook_row).execute()
    except APIError as e:
        return JsonResponse({"error": e.message}, status=400)

    new_notebook = nb_res.data[0]
    notebook_uuid = new_notebook["uuid"]

    # 2) If trading_pairs were provided, look up their IDs and link them
    linked = []
    if isinstance(pair_strings, list) and pair_strings:
        # a) Normalize / dedupe the incoming strings
        cleaned = []
        for s in pair_strings:
            if not isinstance(s, str) or not s.strip():
                return JsonResponse(
                    {"error": f"Invalid trading pair string: {s!r}"},
                    status=400
                )
            cleaned.append(s.strip().upper())
        cleaned_set = list(dict.fromkeys(cleaned))  # preserve order but dedupe

        # b) Fetch all matching IDs from TradingPairs
        try:
            lookup = supabase \
                .table("TradingPairs") \
                .select("id,trading_pair") \
                .in_("trading_pair", cleaned_set) \
                .execute()
        except APIError as e:
            return JsonResponse({"error": f"Supabase lookup error: {e.message}"}, status=500)

        existing_rows = lookup.data or []
        # Build a map: { "BTC/USDT": 17, "ETH/EUR": 23, ... }
        string_to_id = {row["trading_pair"].upper(): row["id"] for row in existing_rows}

        # c) Check for any missing
        missing = [s for s in cleaned_set if s not in string_to_id]
        if missing:
            return JsonResponse(
                {"error": f"These trading pairs do not exist: {missing}"},
                status=400
            )

        # d) Bulk-insert into Notebook_TradingPairs
        payloads = [
            {"notebook_id": notebook_uuid, "trading_pair_id": string_to_id[s]}
            for s in cleaned_set
        ]
        try:
            link_res = (
                supabase
                .table("Notebook_TradingPairs")
                .insert(payloads)
                .execute()
            )
        except APIError as e:
            return JsonResponse({"error": e.message}, status=400)
        linked = link_res.data or []

    return JsonResponse({
        "notebook":     new_notebook,
        "linked_pairs": linked
    }, status=201)


# WARNING: Bypasses CSRF cookie requirement. For testing purposes only.
@csrf_exempt
@require_http_methods(["PUT", "PATCH"])
def update_notebook(request, notebook_uuid):
    """
    1) Update writable columns on Notebook (title, last_updated, etc.).
    2) If "trading_pairs" (strings) is present:
       a) Look up each string in TradingPairs.trading_pair to get its id.
       b) Delete existing rows in Notebook_TradingPairs for this notebook.
       c) Bulk‐insert new ones.
    URL: PATCH /api/notebooks/<uuid>/
    """
    nb_id = str(notebook_uuid)

    # 1) Parse JSON
    try:
        payload = json.loads(request.body)
    except json.JSONDecodeError:
        return JsonResponse({"error": "Invalid JSON"}, status=400)

    # 2) Remove system fields
    for forbidden in ("uuid", "owner_id", "created_at"):
        payload.pop(forbidden, None)

    if not payload:
        return JsonResponse({"error": "No updatable fields provided."}, status=400)

    # 3) Extract trading_pairs if provided
    new_pair_strings = None
    if "trading_pairs" in payload:
        new_pair_strings = payload.pop("trading_pairs")

    # 4) Validate last_updated if present
    if "last_updated" in payload:
        try:
            dt = datetime.fromisoformat(payload["last_updated"])
            payload["last_updated"] = dt.isoformat()
        except ValueError:
            return JsonResponse({"error": "Invalid ISO timestamp for last_updated"}, status=400)

    # 5) Update the base Notebook row
    try:
        upd_res = (
            supabase
            .table("Notebook")
            .update(payload)
            .eq("uuid", nb_id)
            .execute()
        )
    except APIError as e:
        return JsonResponse({"error": e.message}, status=400)

    if not upd_res.data:
        raise Http404("Notebook not found")

    updated_notebook = upd_res.data[0]

    # 6) If trading_pairs was provided, replace join‐table links
    linked = []
    if isinstance(new_pair_strings, list):
        # a) Clean & dedupe strings
        cleaned = []
        for s in new_pair_strings:
            if not isinstance(s, str) or not s.strip():
                return JsonResponse({"error": f"Invalid trading pair string: {s!r}"}, status=400)
            cleaned.append(s.strip().upper())
        cleaned_set = list(dict.fromkeys(cleaned))

        # b) Look up their IDs via "trading_pair" column
        try:
            lookup = (
                supabase
                .table("TradingPairs")
                .select("id,trading_pair")
                .in_("trading_pair", cleaned_set)
                .execute()
            )
        except APIError as e:
            return JsonResponse({"error": f"Supabase lookup error: {e.message}"}, status=500)

        existing_rows = lookup.data or []
        string_to_id = {row["trading_pair"].upper(): row["id"] for row in existing_rows}

        missing = [s for s in cleaned_set if s not in string_to_id]
        if missing:
            return JsonResponse({"error": f"These trading pairs do not exist: {missing}"}, status=400)

        # c) Delete existing links for this notebook
        try:
            supabase \
                .table("Notebook_TradingPairs") \
                .delete() \
                .eq("notebook_id", nb_id) \
                .execute()
        except APIError as e:
            return JsonResponse({"error": e.message}, status=400)

        # d) Bulk‐insert new links
        payloads = [
            {"notebook_id": nb_id, "trading_pair_id": string_to_id[s]}
            for s in cleaned_set
        ]
        try:
            link_res = (
                supabase
                .table("Notebook_TradingPairs")
                .insert(payloads)
                .execute()
            )
        except APIError as e:
            return JsonResponse({"error": e.message}, status=400)
        linked = link_res.data or []

    return JsonResponse({
        "notebook":     updated_notebook,
        "linked_pairs": linked
    }, status=200)


# WARNING: Bypasses CSRF cookie requirement. For testing purposes only.
@csrf_exempt
@require_POST
def sync_trading_pairs(request):
    """
    1) Fetch /api/v3/exchangeInfo from Binance.
    2) Build a set of "BASE/QUOTE" strings for all symbols with status == "TRADING".
    3) Fetch existing trading_pair values from Supabase table TradingPairs.
    4) Insert only the new pairs.
    Returns JSON: { "inserted": [...], "skipped": [...] }
    """
    # 1) Call Binance API
    try:
        resp = requests.get(
            "https://api.binance.com/api/v3/exchangeInfo",
            timeout=10
        )
        resp.raise_for_status()
    except requests.RequestException as e:
        return JsonResponse(
            {"error": f"Binance API error: {str(e)}"},
            status=502
        )

    data = resp.json()
    symbols = data.get("symbols", [])
    if not isinstance(symbols, list):
        return JsonResponse(
            {"error": "Unexpected Binance response format."},
            status=502
        )

    # 2) Normalize to "BASE/QUOTE"
    incoming_set = set()
    for s in symbols:
        # Only consider symbols that are actively trading
        if s.get("status") != "TRADING":
            continue

        base = s.get("baseAsset")
        quote = s.get("quoteAsset")
        # sanity check
        if not (isinstance(base, str) and isinstance(quote, str)):
            continue

        pair = f"{base}/{quote}"
        incoming_set.add(pair)

    if not incoming_set:
        return JsonResponse(
            {"error": "No trading pairs found from Binance."},
            status=502
        )

    # 3) Page through all existing TradingPairs rows (by default Supabase limit is 1000 per page)
    existing_set = set()
    page_size = 1000
    offset = 0

    while True:
        try:
            fetch_res = (
                supabase
                .table("TradingPairs")
                .select("trading_pair")
                .range(offset, offset + page_size - 1)
                .execute()
            )
        except APIError as e:
            return JsonResponse(
                {"error": f"Supabase fetch error: {e.message}"},
                status=500
            )

        batch = fetch_res.data or []
        if not batch:
            break

        for row in batch:
            if "trading_pair" in row and isinstance(row["trading_pair"], str):
                existing_set.add(row["trading_pair"])
        offset += page_size

    # 4) Determine which pairs to insert
    to_insert = list(incoming_set - existing_set)
    skipped = list(incoming_set & existing_set)
    inserted_rows = []

    if to_insert:
        payloads = [{"trading_pair": p} for p in to_insert]
        try:
            insert_res = (
                supabase
                .table("TradingPairs")
                .insert(payloads)
                .execute()
            )
        except APIError as e:
            return JsonResponse(
                {"error": f"Supabase insert error: {e.message}"},
                status=500
            )
        inserted_rows = insert_res.data or []

    return JsonResponse(
        {"inserted": inserted_rows, "skipped": skipped},
        status=201
    )
