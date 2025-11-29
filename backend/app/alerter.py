# backend/app/alerter.py
import os, json, requests
from datetime import datetime
ALERT_WEBHOOK = os.environ.get("QFF_ALERT_WEBHOOK", "")

def notify(level, title, message, metadata=None):
    payload = {"time": datetime.utcnow().isoformat()+"Z","level":level,"title":title,"message":message,"metadata":metadata or {}}
    print("[ALERT]", json.dumps(payload))
    if ALERT_WEBHOOK:
        try:
            requests.post(ALERT_WEBHOOK, json={"text": f"[{level}] {title}: {message}\n{metadata}"}, timeout=2)
        except Exception as e:
            print("Webhook failed", e)
