import pytest
from app.gateway import decide_rail, quote

def test_gateway_routing():
    # Test Crypto
    assert decide_rail({"type": "CRYPTO_TRANSFER"}) == "BLOCKCHAIN_L1"
    
    # Test Forex
    assert decide_rail({"type": "FOREX_PAYMENT"}) == "SWIFT_GPI"
    
    # Test High Value
    assert decide_rail({"amount": 2000000}) == "RTGS_CORE"
    
    # Test Standard
    assert decide_rail({"amount": 100}) == "ACH_INSTANT"

def test_quote():
    tx = {"amount": 1000, "currency": "USD", "type": "PAYMENT"}
    q = quote(tx)
    assert "fees" in q
    assert "rail" in q
    assert q["estimated_time"] == "Instant"
