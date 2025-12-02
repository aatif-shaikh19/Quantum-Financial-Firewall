import uuid
from .database import engine, SessionLocal
from .models import users, accounts, ledger, init_db

def seed_demo_data():
    init_db()
    db = SessionLocal()
    # clear existing (for dev convenience)
    db.execute(ledger.delete())
    db.execute(accounts.delete())
    db.execute(users.delete())
    # seed one user with multiple accounts
    user_id = "user-1"
    db.execute(users.insert().values(id=user_id, username="demo", display_name="Demo User"))
    # accounts: INR bank, SAR bank, USD wallet, BTC wallet
    accts = [
        {"id": "acct-inr-001", "user_id": user_id, "account_type": "BANK", "currency": "INR", "balance": "123000.00"},
        {"id": "acct-sar-001", "user_id": user_id, "account_type": "BANK", "currency": "SAR", "balance": "2500.00"},
        {"id": "acct-usd-001", "user_id": user_id, "account_type": "WALLET", "currency": "USD", "balance": "4300.00"},
        {"id": "acct-btc-001", "user_id": user_id, "account_type": "CRYPTO", "currency": "BTC", "balance": "0.12"}
    ]
    for a in accts:
        db.execute(accounts.insert().values(**a))
    db.commit()
    db.close()
