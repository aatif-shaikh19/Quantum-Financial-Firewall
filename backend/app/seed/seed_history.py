# backend/app/seed/seed_history.py
from ..models import init_db, ledger, accounts
from ..database import engine, SessionLocal
from sqlalchemy import insert
import uuid, random, os

def seed():
    init_db()
    db = SessionLocal()
    # seed accounts
    db.execute(insert(accounts).prefix_with("OR IGNORE").values({
        "id":"acct-1","user_id":"user-1","account_type":"SAVINGS","currency":"INR","balance":"500000.00"
    }))
    db.execute(insert(accounts).prefix_with("OR IGNORE").values({
        "id":"acct-2","user_id":"user-1","account_type":"CRYPTO","currency":"BTC","balance":"2.5"
    }))
    # seed ledger
    for i in range(6):
        tx_id = f"TX-{uuid.uuid4().hex[:8]}"
        db.execute(insert(ledger).values(
            id=tx_id, tx_type="BANK_TRANSFER", amount=str(1000*(i+1)), currency="INR",
            receiver=f"receiver-{i}", risk_score=95, status="COMPLETED", fingerprint=None, meta="{}"
        ))
    db.commit(); db.close()

if __name__=="__main__":
    seed()
