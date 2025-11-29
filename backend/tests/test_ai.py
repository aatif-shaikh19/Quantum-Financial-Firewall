import pytest
from app.ai_engine import AgenticAI

def test_ai_thresholds():
    ai = AgenticAI(demo_seed=42)
    
    # Test Safe Transaction
    tx_safe = {"amount": 100, "type": "PAYMENT", "receiver": "safe-user"}
    res = ai.analyze(tx_safe)
    assert res["score"] >= 85
    assert res["riskLevel"] == "LOW"
    assert res["recommendation"] == "PROCEED"

    # Test Critical/Block (Malicious Receiver)
    tx_malicious = {"amount": 100, "type": "PAYMENT", "receiver": "0xdeadbeef"}
    res = ai.analyze(tx_malicious)
    assert res["score"] < 50
    assert res["riskLevel"] == "CRITICAL"
    assert res["recommendation"] == "BLOCK"
    assert "Receiver flagged" in res["factors"]

    # Test High Value (Flag)
    tx_high = {"amount": 50000, "type": "CRYPTO_TRANSFER", "receiver": "unknown"}
    res = ai.analyze(tx_high)
    # Base 95 - 15 (High Value) - 20 (Crypto) = 60 -> HIGH/FLAG
    assert 50 <= res["score"] < 70
    assert res["riskLevel"] == "HIGH"
    assert res["recommendation"] == "FLAG"

def test_ai_deterministic():
    ai1 = AgenticAI(demo_seed=123)
    ai2 = AgenticAI(demo_seed=123)
    tx = {"amount": 1000, "type": "PAYMENT", "receiver": "user-1"}
    
    res1 = ai1.analyze(tx)
    res2 = ai2.analyze(tx)
    
    assert res1["score"] == res2["score"]
    assert res1["factors"] == res2["factors"]
