from fastapi import FastAPI
from pydantic import BaseModel
from ai_engine.risk_model import evaluate_risk
from decision_layer.rules_engine import apply_rules
from database.audit_logs import save_log

app = FastAPI(title="Quantum Financial Firewall")

# Request schema
class Transaction(BaseModel):
    sender: str
    receiver: str
    amount: float
    currency: str

@app.post("/scan_transaction")
def scan_transaction(tx: Transaction):
    risk_score = evaluate_risk(tx.dict())
    decision = apply_rules(tx.dict(), risk_score)
    save_log(tx.dict(), risk_score, decision)

    return {
        "transaction": tx.dict(),
        "risk_score": risk_score,
        "decision": decision
    }

