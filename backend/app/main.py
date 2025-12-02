# backend/app/main.py
from fastapi import FastAPI, HTTPException, Query, Depends
from fastapi.middleware.cors import CORSMiddleware
from .database import SessionLocal, engine
from .models import (
    init_db, ledger, accounts, users,
    TransactionRequest, ExecuteRequest, ErrorResponse,
    UserRegister, UserLogin, UserResponse, TokenResponse, UserUpdate
)
from fastapi.exceptions import RequestValidationError
from fastapi.responses import JSONResponse
from .ai_engine import AgenticAI
from .pqc_sim import establish_key, simulate_qkd_interception, encapsulate_payload, export_pqc_demo
from .gateway import quote, exec_on_rail, decide_rail
from .telemetry import ANALYZE_COUNT, QKD_ATTEMPT, metrics_endpoint
from .utils import gen_id, fingerprint
from .alerter import notify
from .quantum_layer import establish_quantum_key, get_quantum_info
from .security import (
    verify_admin, get_current_user, require_admin,
    hash_password, verify_password, create_access_token, generate_user_id
)
from sqlalchemy import select, insert, update, delete
from datetime import datetime
import os, uuid

# Initialize database
init_db()

# Seed demo users with passwords on startup
def seed_users():
    """Seed demo users with proper passwords"""
    db = SessionLocal()
    try:
        # Check if users already exist
        existing = db.execute(select(users)).fetchall()
        if len(existing) > 0:
            print(f"Found {len(existing)} existing users, skipping seed")
            return
        
        # Create admin user
        admin_id = generate_user_id()
        db.execute(insert(users).values(
            id=admin_id,
            username="admin",
            email="admin@qff.local",
            password_hash=hash_password("admin123"),
            role="admin",
            is_active=True
        ))
        
        # Create demo user
        demo_id = "user-1"  # Match the existing account user_id
        db.execute(insert(users).values(
            id=demo_id,
            username="demo",
            email="demo@qff.local",
            password_hash=hash_password("demo123"),
            role="user",
            is_active=True
        ))
        
        # Create test user
        test_id = generate_user_id()
        db.execute(insert(users).values(
            id=test_id,
            username="testuser",
            email="test@qff.local",
            password_hash=hash_password("test123"),
            role="user",
            is_active=True
        ))
        
        db.commit()
        print("Seeded 3 users: admin (admin123), demo (demo123), testuser (test123)")
    except Exception as e:
        db.rollback()
        print(f"Could not seed users: {e}")
    finally:
        db.close()

seed_users()

# Seed demo data on startup (optional - won't crash if it fails)
try:
    from .seed import seed_demo_data
    print("Seeding demo data...")
    seed_demo_data()
    print("Demo data seeded successfully!")
except Exception as e:
    print(f"Note: Could not seed demo data: {e}")
    print("This is OK - the system will work without seed data")

DEMO_SEED = int(os.environ.get("QFF_DEMO_SEED", "0")) or None
INTERCEPT_PROB = float(os.environ.get("QFF_INTERCEPT_PROB","0.0"))
ai = AgenticAI(DEMO_SEED)
app = FastAPI(title="QFF Backend - Quantum Financial Firewall", version="1.0.0")

origins = os.environ.get("QFF_CORS_ORIGINS", "http://localhost:3000,http://localhost:3001,http://localhost:5173,http://localhost:8000").split(",")
app.add_middleware(CORSMiddleware, allow_origins=["*"], allow_methods=["*"], allow_headers=["*"], allow_credentials=True)

@app.exception_handler(RequestValidationError)
async def validation_exception_handler(request, exc):
    return JSONResponse(
        status_code=400,
        content={"errorCode": "VALIDATION_ERROR", "userMessage": "Invalid request parameters", "details": str(exc)}
    )

# ============ AUTH ENDPOINTS ============

@app.post("/auth/register", response_model=TokenResponse)
def register(user_data: UserRegister):
    """Register a new user"""
    db = SessionLocal()
    try:
        # Check if username exists
        existing = db.execute(
            select(users).where(users.c.username == user_data.username)
        ).fetchone()
        if existing:
            raise HTTPException(status_code=400, detail="Username already exists")
        
        # Check if email exists
        existing_email = db.execute(
            select(users).where(users.c.email == user_data.email)
        ).fetchone()
        if existing_email:
            raise HTTPException(status_code=400, detail="Email already registered")
        
        # Create new user
        user_id = generate_user_id()
        db.execute(insert(users).values(
            id=user_id,
            username=user_data.username,
            email=user_data.email,
            password_hash=hash_password(user_data.password),
            role="user",
            is_active=True
        ))
        
        # Create default accounts for the new user
        db.execute(insert(accounts).values(
            id=f"acc-{user_id}-bank",
            user_id=user_id,
            account_type="BANK",
            currency="USD",
            balance="1000.00"
        ))
        db.execute(insert(accounts).values(
            id=f"acc-{user_id}-crypto",
            user_id=user_id,
            account_type="CRYPTO",
            currency="BTC",
            balance="0.05"
        ))
        
        db.commit()
        
        # Generate token
        token = create_access_token({
            "sub": user_id,
            "username": user_data.username,
            "role": "user"
        })
        
        return TokenResponse(
            access_token=token,
            user=UserResponse(
                id=user_id,
                username=user_data.username,
                email=user_data.email,
                role="user",
                is_active=True
            )
        )
    except HTTPException:
        raise
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=500, detail=str(e))
    finally:
        db.close()

@app.post("/auth/login", response_model=TokenResponse)
def login(credentials: UserLogin):
    """Login and get access token"""
    db = SessionLocal()
    try:
        user = db.execute(
            select(users).where(users.c.username == credentials.username)
        ).fetchone()
        
        if not user:
            raise HTTPException(status_code=401, detail="Invalid username or password")
        
        if not verify_password(credentials.password, user.password_hash):
            raise HTTPException(status_code=401, detail="Invalid username or password")
        
        if not user.is_active:
            raise HTTPException(status_code=403, detail="Account is disabled")
        
        # Update last login
        db.execute(
            update(users).where(users.c.id == user.id).values(last_login=datetime.utcnow())
        )
        db.commit()
        
        # Generate token
        token = create_access_token({
            "sub": user.id,
            "username": user.username,
            "role": user.role
        })
        
        return TokenResponse(
            access_token=token,
            user=UserResponse(
                id=user.id,
                username=user.username,
                email=user.email,
                role=user.role,
                is_active=user.is_active
            )
        )
    finally:
        db.close()

@app.get("/auth/me", response_model=UserResponse)
def get_me(current_user: dict = Depends(get_current_user)):
    """Get current user profile"""
    db = SessionLocal()
    try:
        user = db.execute(
            select(users).where(users.c.id == current_user["user_id"])
        ).fetchone()
        
        if not user:
            raise HTTPException(status_code=404, detail="User not found")
        
        return UserResponse(
            id=user.id,
            username=user.username,
            email=user.email,
            role=user.role,
            is_active=user.is_active
        )
    finally:
        db.close()

# ============ ADMIN ENDPOINTS ============

@app.get("/admin/users")
def list_users(current_user: dict = Depends(require_admin)):
    """List all users (admin only)"""
    db = SessionLocal()
    try:
        rows = db.execute(select(users).order_by(users.c.created_at.desc())).fetchall()
        return {
            "users": [
                {
                    "id": r.id,
                    "username": r.username,
                    "email": r.email,
                    "role": r.role,
                    "is_active": r.is_active,
                    "created_at": str(r.created_at) if r.created_at else None,
                    "last_login": str(r.last_login) if r.last_login else None
                }
                for r in rows
            ]
        }
    finally:
        db.close()

@app.put("/admin/users/{user_id}")
def update_user(user_id: str, user_update: UserUpdate, current_user: dict = Depends(require_admin)):
    """Update user (admin only)"""
    db = SessionLocal()
    try:
        # Check user exists
        user = db.execute(select(users).where(users.c.id == user_id)).fetchone()
        if not user:
            raise HTTPException(status_code=404, detail="User not found")
        
        # Build update dict
        update_data = {}
        if user_update.email is not None:
            update_data["email"] = user_update.email
        if user_update.role is not None:
            update_data["role"] = user_update.role
        if user_update.is_active is not None:
            update_data["is_active"] = user_update.is_active
        
        if update_data:
            db.execute(update(users).where(users.c.id == user_id).values(**update_data))
            db.commit()
        
        return {"message": "User updated successfully"}
    finally:
        db.close()

@app.delete("/admin/users/{user_id}")
def delete_user(user_id: str, current_user: dict = Depends(require_admin)):
    """Delete user (admin only)"""
    db = SessionLocal()
    try:
        # Prevent deleting self
        if user_id == current_user["user_id"]:
            raise HTTPException(status_code=400, detail="Cannot delete yourself")
        
        db.execute(delete(users).where(users.c.id == user_id))
        db.commit()
        return {"message": "User deleted successfully"}
    finally:
        db.close()

@app.get("/admin/stats")
def admin_stats(current_user: dict = Depends(require_admin)):
    """Get system statistics (admin only)"""
    db = SessionLocal()
    try:
        user_count = len(db.execute(select(users)).fetchall())
        tx_count = len(db.execute(select(ledger)).fetchall())
        account_count = len(db.execute(select(accounts)).fetchall())
        
        # Get recent transactions
        recent_txs = db.execute(
            select(ledger).order_by(ledger.c.timestamp.desc()).limit(10)
        ).fetchall()
        
        return {
            "total_users": user_count,
            "total_transactions": tx_count,
            "total_accounts": account_count,
            "recent_transactions": [
                {"id": r.id, "type": r.tx_type, "amount": r.amount, "status": r.status}
                for r in recent_txs
            ]
        }
    finally:
        db.close()

# ============ EXISTING ENDPOINTS ============

@app.get("/health")
def health(): return {"status":"ok","phase":"6-ready","version":"1.0.0"}

@app.get("/metrics", dependencies=[Depends(verify_admin)])
def metrics():
    return metrics_endpoint()

@app.get("/balance")
def balance(userId: str = None, current_user: dict = Depends(get_current_user)):
    """Get balance for current user or specified user (admin)"""
    target_user = userId if userId and current_user.get("role") == "admin" else current_user["user_id"]
    
    db = SessionLocal()
    stmt = select(accounts).where(accounts.c.user_id == target_user)
    rows = db.execute(stmt).fetchall()
    db.close()
    res = [{"accountId":r.id,"accountType":r.account_type,"currency":r.currency,"balance":r.balance} for r in rows]
    return {"userId": target_user, "balances": res}

@app.post("/quote")
def get_quote(tx: TransactionRequest):
    return quote(tx.dict())

@app.post("/route")
def get_route(tx: TransactionRequest):
    return {"rail": decide_rail(tx.dict())}

@app.post("/analyze")
def analyze(tx: TransactionRequest):
    # fetch some history amounts
    db = SessionLocal()
    rows = db.execute(select(ledger.c.amount).order_by(ledger.c.timestamp.desc()).limit(500)).fetchall()
    history = [{"amount": r.amount} for r in rows]
    db.close()
    res = ai.analyze(tx.dict(), history)
    ANALYZE_COUNT.inc()
    if res.get("riskLevel") == "CRITICAL" or res.get("recommendation") == "BLOCK":
        notify("CRITICAL","Transaction flagged", f"score={res.get('score')}", {"tx": tx.dict(), "ai": res})
    return res

@app.post("/establish-key")
def establish_key_endpoint(demo_seed: int = Query(None), intercept_prob: float = Query(None)):
    prob = INTERCEPT_PROB if intercept_prob is None else float(intercept_prob)
    intercepted = simulate_qkd_interception(probability=prob, demo_seed=demo_seed)
    QKD_ATTEMPT.inc()
    if intercepted:
        notify("SECURITY","QKD interception","Interception simulated",{"prob":prob})
        return {"status":"INTERCEPTED","key":None}
    key = establish_key(demo_seed)
    return {"status":"KEY_ESTABLISHED","key":key}

@app.post("/execute")
def execute(req: ExecuteRequest, current_user: dict = Depends(get_current_user)):
    tx = req.dict(exclude={"key", "risk_score"})
    key = req.key
    risk_score = req.risk_score or 100
    # route & execute
    exec_res = exec_on_rail(tx)
    enc = encapsulate_payload(tx, key or "nokey")
    fp = fingerprint(tx, key or "nokey")
    tx_id = gen_id()
    db = SessionLocal()
    db.execute(insert(ledger).values(
        id=tx_id, user_id=current_user["user_id"], tx_type=tx.get("type"), amount=tx.get("amount"), currency=tx.get("currency"),
        receiver=tx.get("receiver"), risk_score=int(risk_score), status="COMPLETED" if exec_res.get("success") else "FAILED",
        fingerprint=fp, meta=str({"enc":enc,"exec":exec_res})
    ))
    db.commit(); db.close()
    return {"tx_id": tx_id, "fingerprint": fp, "routed_rail": exec_res.get("rail"), "fees": exec_res.get("fees"), "backend_reference": exec_res.get("backend_ref")}

@app.get("/history")
def history(limit: int = 50, current_user: dict = Depends(get_current_user)):
    """Get transaction history for current user"""
    db = SessionLocal()
    
    # Admin sees all, users see only their own
    if current_user.get("role") == "admin":
        stmt = select(ledger).order_by(ledger.c.timestamp.desc()).limit(limit)
    else:
        stmt = select(ledger).where(
            ledger.c.user_id == current_user["user_id"]
        ).order_by(ledger.c.timestamp.desc()).limit(limit)
    
    rows = db.execute(stmt).fetchall()
    db.close()
    items = []
    for r in rows:
        items.append({"id":r.id,"timestamp":str(r.timestamp),"type":r.tx_type,"amount":r.amount,"currency":r.currency,"receiver":r.receiver,"riskScore":r.risk_score,"status":r.status,"quantumKeySnippet": (r.fingerprint or "")[:12]})
    return {"history": items}

@app.get("/pqc-info")
def pqc_info(): 
    base_info = export_pqc_demo()
    quantum_info = get_quantum_info()
    return {**base_info, **quantum_info}

@app.get("/quantum-status")
def quantum_status():
    """Get quantum layer status and metrics"""
    return get_quantum_info()

@app.post("/quantum-establish")
def quantum_establish(intercept_prob: float = Query(0.0)):
    """Establish quantum-safe session using real PQC"""
    result = establish_quantum_key(intercept_prob=intercept_prob)
    QKD_ATTEMPT.inc()
    if result.get("status") == "INTERCEPTED":
        notify("SECURITY", "Quantum interception", "QKD interception detected", result)
    return result

# ============ ENTERPRISE SECURITY CONSOLE ============

@app.get("/security/status")
def security_status(current_user: dict = Depends(require_admin)):
    """Get comprehensive security status (admin only)"""
    from .security_layer import security_layer
    from .immutable_ledger import immutable_ledger
    from .alerter import get_alert_stats
    
    return {
        "encryption": security_layer.get_security_status(),
        "ledger_integrity": immutable_ledger.verify_chain(100),
        "quantum": get_quantum_info(),
        "alerts": get_alert_stats(),
        "status": "OPERATIONAL"
    }

@app.get("/security/alerts")
def security_alerts(limit: int = 50, current_user: dict = Depends(require_admin)):
    """Get recent security alerts (admin only)"""
    from .alerter import get_alert_history
    return {"alerts": get_alert_history(limit)}

@app.get("/security/audit/{tx_id}")
def security_audit(tx_id: str, current_user: dict = Depends(require_admin)):
    """Get audit trail for a transaction (admin only)"""
    from .immutable_ledger import immutable_ledger
    trail = immutable_ledger.get_audit_trail(tx_id)
    if not trail:
        raise HTTPException(status_code=404, detail="Transaction not found")
    return trail

@app.post("/security/verify-chain")
def verify_chain(current_user: dict = Depends(require_admin)):
    """Verify ledger integrity (admin only)"""
    from .immutable_ledger import immutable_ledger
    return immutable_ledger.verify_chain()

@app.get("/security/encryption-status")
def encryption_status(current_user: dict = Depends(require_admin)):
    """Get encryption layer status (admin only)"""
    from .security_layer import security_layer
    return security_layer.get_security_status()

# ============ TRANSACTION TYPES INFO ============

@app.get("/transaction-types")
def get_transaction_types():
    """Get all supported transaction types"""
    return {
        "types": [
            {"code": "BANK_TRANSFER", "name": "Bank Transfer", "rail": "BANK_RAIL", "reversible": True},
            {"code": "UPI_PAYMENT", "name": "UPI Payment", "rail": "UPI", "reversible": True},
            {"code": "CARD_PAYMENT", "name": "Card Payment", "rail": "CARD", "reversible": True},
            {"code": "CRYPTO_TRANSFER", "name": "Crypto Transfer", "rail": "BLOCKCHAIN", "reversible": False},
            {"code": "SMART_CONTRACT", "name": "Smart Contract", "rail": "SMART_CONTRACT", "reversible": False},
            {"code": "FOREX_PAYMENT", "name": "Forex Payment", "rail": "FOREX", "reversible": True},
            {"code": "WIRE_TRANSFER", "name": "Wire Transfer", "rail": "WIRE", "reversible": True},
            {"code": "ACH_TRANSFER", "name": "ACH Transfer", "rail": "ACH", "reversible": True},
            {"code": "SEPA_TRANSFER", "name": "SEPA Transfer", "rail": "SEPA", "reversible": True},
            {"code": "SWIFT_PAYMENT", "name": "SWIFT Payment", "rail": "SWIFT", "reversible": True}
        ],
        "currencies": [
            {"code": "USD", "name": "US Dollar", "type": "fiat"},
            {"code": "EUR", "name": "Euro", "type": "fiat"},
            {"code": "GBP", "name": "British Pound", "type": "fiat"},
            {"code": "INR", "name": "Indian Rupee", "type": "fiat"},
            {"code": "JPY", "name": "Japanese Yen", "type": "fiat"},
            {"code": "SAR", "name": "Saudi Riyal", "type": "fiat"},
            {"code": "AED", "name": "UAE Dirham", "type": "fiat"},
            {"code": "BTC", "name": "Bitcoin", "type": "crypto"},
            {"code": "ETH", "name": "Ethereum", "type": "crypto"},
            {"code": "USDT", "name": "Tether", "type": "stablecoin"},
            {"code": "USDC", "name": "USD Coin", "type": "stablecoin"}
        ],
        "rails": [
            {"code": "BANK_RAIL", "name": "Traditional Banking", "quantum_protected": True},
            {"code": "UPI", "name": "Unified Payments Interface", "quantum_protected": True},
            {"code": "CARD", "name": "Card Networks", "quantum_protected": True},
            {"code": "BLOCKCHAIN", "name": "Blockchain Network", "quantum_protected": True},
            {"code": "SMART_CONTRACT", "name": "Smart Contract Execution", "quantum_protected": True},
            {"code": "FOREX", "name": "Foreign Exchange", "quantum_protected": True},
            {"code": "SWIFT", "name": "SWIFT Network", "quantum_protected": True},
            {"code": "SEPA", "name": "SEPA Network", "quantum_protected": True}
        ]
    }
