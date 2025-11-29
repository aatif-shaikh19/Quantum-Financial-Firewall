# backend/app/gateway.py
from decimal import Decimal
import uuid

def decide_rail(tx):
    t = (tx.get("type") or "").upper()
    if t == "CRYPTO_TRANSFER": return "BLOCKCHAIN"
    if t == "SMART_CONTRACT": return "SMART_CONTRACT"
    if t == "UPI_PAYMENT": return "UPI"
    if t == "CARD_PAYMENT": return "CARD"
    if t == "FOREX_PAYMENT": return "FOREX"
    return "BANK_RAIL"

def quote(tx):
    rail = decide_rail(tx)
    amount = tx.get("amount","0")
    fees = {}
    if rail == "UPI": fees={"flat":"0.00","percent":"0.001"}
    elif rail == "CARD": fees={"flat":"0.30","percent":"0.02"}
    elif rail == "BLOCKCHAIN": fees={"network_fee":"0.0005"}
    else: fees={"flat":"5.00","percent":"0.0005"}
    return {"amount": amount, "currency": tx.get("currency"), "fees": fees, "rail": rail}

def exec_on_rail(tx, demo_seed=None):
    rail = decide_rail(tx)
    backend_ref = f"{rail[:6]}-{uuid.uuid4().hex[:10]}"
    fees = {"flat":"0.00"}
    if rail == "BLOCKCHAIN": fees={"network_fee":"0.0005"}
    return {"success": True, "backend_ref": backend_ref, "fees": fees, "rail": rail}
