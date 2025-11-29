# backend/simulate_run.py
import requests, time, os, json

API = os.environ.get("QFF_API_BASE","http://localhost:8000")
REPORT_FILE = "demo_report.txt"

def post(path, json_data=None, params=None):
    try:
        return requests.post(API+path, json=json_data or {}, params=params).json()
    except Exception as e:
        return {"error": str(e)}

def log(msg):
    print(msg)
    with open(REPORT_FILE, "a") as f:
        f.write(msg + "\n")

def run_scenario(name, tx, intercept_prob=0.0):
    log(f"\n--- Scenario: {name} ---")
    log(f"Transaction: {json.dumps(tx)}")
    
    # 1. Analyze
    log("1. Analyzing...")
    analysis = post("/analyze", json_data=tx)
    log(f"   Score: {analysis.get('score')} ({analysis.get('riskLevel')})")
    log(f"   Recommendation: {analysis.get('recommendation')}")
    log(f"   Factors: {analysis.get('factors')}")

    # 2. Establish Key
    log(f"2. Establishing Quantum Key (Intercept Prob: {intercept_prob})...")
    key_res = post("/establish-key", params={"intercept_prob": intercept_prob})
    log(f"   Status: {key_res.get('status')}")
    
    key = key_res.get("key")
    if not key and key_res.get("status") == "INTERCEPTED":
        log("   [!] Key interception detected! Aborting execution.")
        return

    # 3. Execute (if not blocked)
    if analysis.get("recommendation") == "BLOCK":
        log("   [!] AI Blocked transaction. Skipping execution.")
        return

    log("3. Executing...")
    payload = tx.copy()
    payload["key"] = key
    payload["risk_score"] = analysis.get("score")
    exec_res = post("/execute", json_data=payload)
    log(f"   Result: {exec_res}")

def main():
    # Clear report
    with open(REPORT_FILE, "w") as f:
        f.write("QFF Judge Demo Report\n=====================\n")

    # Scenario 1: Safe Transaction
    run_scenario("Safe Transaction", {
        "amount": 500, "currency": "USD", "type": "PAYMENT", "receiver": "user-safe"
    })

    # Scenario 2: Suspicious High Value
    run_scenario("Suspicious High Value", {
        "amount": 50000, "currency": "USD", "type": "CRYPTO_TRANSFER", "receiver": "unknown-wallet"
    })

    # Scenario 3: Malicious Receiver
    run_scenario("Malicious Receiver", {
        "amount": 100, "currency": "USD", "type": "PAYMENT", "receiver": "0xdeadbeef"
    })

    # Scenario 4: QKD Interception
    run_scenario("QKD Interception Attempt", {
        "amount": 1000, "currency": "USD", "type": "PAYMENT", "receiver": "user-target"
    }, intercept_prob=1.0)

    log("\n--- End of Demo ---")
    print(f"Report written to {REPORT_FILE}")

if __name__=="__main__":
    main()
