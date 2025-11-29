# backend/app/pqc_sim.py
import random, time, base64, json
def simulate_qkd_interception(probability: float = 0.0, demo_seed: int = None) -> bool:
    rnd = random.Random(demo_seed) if demo_seed is not None else random
    return rnd.random() < probability

def establish_key(demo_seed: int = None) -> str:
    rnd = random.Random(time.time() if demo_seed is None else demo_seed)
    key = "qhk_" + "".join([rnd.choice("0123456789abcdef") for _ in range(32)])
    return key

def encrypt_payload(payload: dict, key: str) -> str:
    raw = json.dumps(payload)
    return "PQC::REDACTED::" + base64.b64encode(raw.encode()).decode()[:80]

def encapsulate_payload(payload: dict, key: str):
    return encrypt_payload(payload, key)

def export_pqc_demo():
    return {"pqc": "Kyber-KEM simulated", "signature": "Dilithium simulated"}
