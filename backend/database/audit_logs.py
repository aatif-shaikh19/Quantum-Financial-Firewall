import json
from datetime import datetime

def save_log(tx, risk_score, decision):
    log_entry = {
        "timestamp": str(datetime.utcnow()),
        "transaction": tx,
        "risk_score": risk_score,
        "decision": decision
    }
    with open("audit_logs.json", "a") as f:
        f.write(json.dumps(log_entry) + "\n")

