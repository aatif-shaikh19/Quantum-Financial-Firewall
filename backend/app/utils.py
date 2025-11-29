# backend/app/utils.py
import uuid, hashlib, json

def gen_id(prefix="TX"):
    return f"{prefix}-{uuid.uuid4().hex[:10]}"

def fingerprint(payload: dict, key: str):
    s = json.dumps(payload, sort_keys=True) + "|" + (key or "")
    return hashlib.sha256(s.encode()).hexdigest()
