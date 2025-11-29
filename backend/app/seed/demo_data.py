# backend/app/seed/demo_data.py
"""
Seed demo data for QFF Phase 1
Creates accounts and sample transactions
Note: Users are now seeded in main.py with proper password hashes
"""
from ..database import SessionLocal, engine
from ..models import metadata, accounts, ledger
from sqlalchemy import insert, select, delete
import uuid

def seed_demo_data():
    """Seed database with demo data (accounts and transactions only)"""
    db = SessionLocal()
    
    try:
        # Check if accounts already exist
        existing = db.execute(select(accounts)).fetchall()
        if len(existing) > 0:
            print(f"Found {len(existing)} existing accounts, skipping seed")
            return
        
        # Seed accounts for user-1 (demo user)
        demo_accounts = [
            # Traditional Banking
            {
                "id": "acct-inr-001",
                "user_id": "user-1",
                "account_type": "BANK",
                "currency": "INR",
                "balance": "123000.00"
            },
            {
                "id": "acct-sar-001",
                "user_id": "user-1",
                "account_type": "BANK",
                "currency": "SAR",
                "balance": "2500.00"
            },
            {
                "id": "acct-usd-001",
                "user_id": "user-1",
                "account_type": "BANK",
                "currency": "USD",
                "balance": "4300.00"
            },
            {
                "id": "acct-eur-001",
                "user_id": "user-1",
                "account_type": "BANK",
                "currency": "EUR",
                "balance": "3200.00"
            },
            {
                "id": "acct-upi-001",
                "user_id": "user-1",
                "account_type": "UPI",
                "currency": "INR",
                "balance": "15000.00"
            },
            {
                "id": "acct-wallet-001",
                "user_id": "user-1",
                "account_type": "WALLET",
                "currency": "USD",
                "balance": "850.00"
            },
            
            # Cryptocurrency
            {
                "id": "acct-btc-001",
                "user_id": "user-1",
                "account_type": "CRYPTO",
                "currency": "BTC",
                "balance": "0.12345678"
            },
            {
                "id": "acct-eth-001",
                "user_id": "user-1",
                "account_type": "CRYPTO",
                "currency": "ETH",
                "balance": "2.5"
            },
            {
                "id": "acct-usdt-001",
                "user_id": "user-1",
                "account_type": "CRYPTO",
                "currency": "USDT",
                "balance": "5000.00"
            },
            
            # Cards
            {
                "id": "acct-card-001",
                "user_id": "user-1",
                "account_type": "CARD",
                "currency": "USD",
                "balance": "10000.00"  # Credit limit
            }
        ]
        
        for account in demo_accounts:
            db.execute(insert(accounts).values(**account))
        
        # Seed accounts for user-2 (Alice)
        alice_accounts = [
            {
                "id": "acct-alice-inr",
                "user_id": "user-2",
                "account_type": "BANK",
                "currency": "INR",
                "balance": "50000.00"
            },
            {
                "id": "acct-alice-btc",
                "user_id": "user-2",
                "account_type": "CRYPTO",
                "currency": "BTC",
                "balance": "0.5"
            }
        ]
        
        for account in alice_accounts:
            db.execute(insert(accounts).values(**account))
        
        # Seed accounts for user-3 (Bob)
        bob_accounts = [
            {
                "id": "acct-bob-usd",
                "user_id": "user-3",
                "account_type": "BANK",
                "currency": "USD",
                "balance": "25000.00"
            },
            {
                "id": "acct-bob-eth",
                "user_id": "user-3",
                "account_type": "CRYPTO",
                "currency": "ETH",
                "balance": "5.0"
            }
        ]
        
        for account in bob_accounts:
            db.execute(insert(accounts).values(**account))
        
        # Seed sample transaction history
        sample_transactions = [
            {
                "id": f"TX-{uuid.uuid4().hex[:10]}",
                "tx_type": "BANK_TRANSFER",
                "amount": "1000.00",
                "currency": "INR",
                "receiver": "alice@bank.com",
                "risk_score": 95,
                "status": "COMPLETED",
                "fingerprint": "fp_abc123",
                "meta": '{"note": "Payment for services"}'
            },
            {
                "id": f"TX-{uuid.uuid4().hex[:10]}",
                "tx_type": "UPI_PAYMENT",
                "amount": "500.00",
                "currency": "INR",
                "receiver": "bob@upi",
                "risk_score": 90,
                "status": "COMPLETED",
                "fingerprint": "fp_def456",
                "meta": '{"note": "Coffee payment"}'
            },
            {
                "id": f"TX-{uuid.uuid4().hex[:10]}",
                "tx_type": "CRYPTO_TRANSFER",
                "amount": "0.01",
                "currency": "BTC",
                "receiver": "bc1q...",
                "risk_score": 75,
                "status": "COMPLETED",
                "fingerprint": "fp_ghi789",
                "meta": '{"note": "Crypto transfer"}'
            },
            {
                "id": f"TX-{uuid.uuid4().hex[:10]}",
                "tx_type": "CARD_PAYMENT",
                "amount": "150.00",
                "currency": "USD",
                "receiver": "merchant.com",
                "risk_score": 88,
                "status": "COMPLETED",
                "fingerprint": "fp_jkl012",
                "meta": '{"note": "Online purchase"}'
            },
            {
                "id": f"TX-{uuid.uuid4().hex[:10]}",
                "tx_type": "FOREX_PAYMENT",
                "amount": "2000.00",
                "currency": "EUR",
                "receiver": "international-vendor",
                "risk_score": 70,
                "status": "COMPLETED",
                "fingerprint": "fp_mno345",
                "meta": '{"note": "Cross-border payment"}'
            }
        ]
        
        for tx in sample_transactions:
            db.execute(insert(ledger).values(**tx))
        
        db.commit()
        print("✅ Demo data seeded successfully!")
        
    except Exception as e:
        print(f"❌ Error seeding data: {e}")
        db.rollback()
        raise
    finally:
        db.close()


if __name__ == "__main__":
    seed_demo_data()
