from pydantic import BaseModel
from typing import Dict, Any, Optional, List

class BalanceItem(BaseModel):
    accountId: str
    accountType: str
    currency: str
    balance: str

class BalanceResp(BaseModel):
    userId: str
    balances: List[BalanceItem]

class TxIn(BaseModel):
    type: str
    amount: str
    currency: str
    receiver: str
    details: Dict[str, Any] = {}

class AIResult(BaseModel):
    score: int
    riskLevel: str
    factors: list
    recommendation: str
    narrative: str

class KeyResp(BaseModel):
    status: str
    key: Optional[str] = None

class ExecuteResp(BaseModel):
    tx_id: str
    fingerprint: str

class HistoryResp(BaseModel):
    history: list
