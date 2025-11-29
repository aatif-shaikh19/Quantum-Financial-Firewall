# backend/app/ai_engine.py
import random, threading
from typing import Dict, Any, List
import numpy as np
from sklearn.ensemble import IsolationForest

"""
QFF AI Engine Decision Thresholds:
----------------------------------
Score < 50  : CRITICAL (BLOCK)   - High probability of fraud
Score 50-69 : HIGH     (FLAG)    - Suspicious, requires review
Score 70-84 : MEDIUM   (PROCEED) - Moderate risk, log for audit
Score 85+   : LOW      (PROCEED) - Safe transaction

Velocity Rules:
- Random velocity checks (simulated)
- Isolation Forest anomaly detection on amounts
"""

class AgenticAI:
    def __init__(self, demo_seed=None):
        self.demo_seed = demo_seed
        if demo_seed is not None:
            random.seed(demo_seed)
            np.random.seed(demo_seed)
        self._amount_history = [10,20,50,100,200,500,1000,5000]
        self._build_iso(self._amount_history)

    def _build_iso(self, amounts):
        try:
            X = np.array(amounts).reshape(-1,1)
            self.iso = IsolationForest(contamination=0.05, random_state=42).fit(X)
        except Exception:
            self.iso = None

    def _is_anomaly(self, amt):
        if not self.iso: return False
        try:
            return self.iso.predict([[amt]])[0] == -1
        except Exception:
            return False

    def analyze(self, tx: Dict[str, Any], history: List[Dict[str,Any]] = None) -> Dict[str,Any]:
        base = 95.0
        factors = []
        explain = {"amount":0.0,"type":0.0,"receiver":0.0,"anomaly":0.0,"velocity":0.0}
        try:
            amt = float(tx.get("amount",0))
        except:
            amt = 0.0

        if amt <= 0:
            base -= 40; explain["amount"] += 40; factors.append("Invalid or zero amount")
        else:
            if amt > 10000:
                base -= 15; explain["amount"] += 15; factors.append("High-value transaction")
            if self._is_anomaly(amt):
                base -= 25; explain["anomaly"] += 25; factors.append("Anomalous amount")

        t = (tx.get("type") or "").upper()
        if t in ("CRYPTO_TRANSFER","SMART_CONTRACT"):
            base -= 20; explain["type"] += 20; factors.append("Irreversible chain transaction")
        elif t == "FOREX_PAYMENT":
            base -= 10; explain["type"] += 10; factors.append("Cross-border")

        receiver = (tx.get("receiver") or "").lower()
        if receiver.startswith("0xdead") or "unverified" in receiver:
            base = 0; explain["receiver"] += 100; factors.append("Receiver flagged")

        rnd = random.Random(self.demo_seed) if self.demo_seed is not None else random
        if rnd.random() > 0.995:
            base -= 10; explain["velocity"] += 10; factors.append("Velocity spike")

        score = int(max(0, min(100, base)))
        if score < 50: level="CRITICAL"; rec="BLOCK"
        elif score < 70: level="HIGH"; rec="FLAG"
        elif score < 85: level="MEDIUM"; rec="PROCEED"
        else: level="LOW"; rec="PROCEED"

        narrative = f"Analyzed {t} -> receiver {receiver[:24]}"

        # background update of iso with history amounts
        if history:
            try:
                amounts = [float(h.get("amount",0)) for h in history if float(h.get("amount",0))>0]
                if amounts:
                    thread = threading.Thread(target=self._build_iso, args=(amounts[-200:],))
                    thread.daemon=True
                    thread.start()
            except:
                pass

        explain = {k:v for k,v in explain.items() if v>0.0}
        return {"score":score,"riskLevel":level,"factors":factors,"recommendation":rec,"narrative":narrative,"explainability":explain}
