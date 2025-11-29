# backend/app/telemetry.py
from prometheus_client import Counter, generate_latest, CONTENT_TYPE_LATEST
from fastapi import Response

ANALYZE_COUNT = Counter("qff_analyze_total", "Analyze calls")
QKD_ATTEMPT = Counter("qff_qkd_attempt_total", "QKD attempts")

def metrics_endpoint():
    return Response(generate_latest(), media_type=CONTENT_TYPE_LATEST)
