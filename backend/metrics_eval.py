# backend/metrics_eval.py
from app.ai_engine import AgenticAI
from app.database import SessionLocal
from app.models import ledger
from sqlalchemy import select
import numpy as np

def load_ledger(n=200):
    db = SessionLocal()
    rows = db.execute(select(ledger).order_by(ledger.c.timestamp.desc()).limit(n)).fetchall()
    db.close()
    return rows

def evaluate():
    ai = AgenticAI()
    rows = load_ledger(200)
    y_true=[]
    y_pred=[]
    for r in rows:
        tx={"type":r.tx_type,"amount":r.amount,"currency":r.currency,"receiver":r.receiver}
        res=ai.analyze(tx, [])
        pred = 1 if res['recommendation']=="BLOCK" or res['score']<70 else 0
        true = 1 if r.status in ("BLOCKED","FAILED") else 0
        y_true.append(true); y_pred.append(pred)
    y_true=np.array(y_true); y_pred=np.array(y_pred)
    tp=int(((y_true==1)&(y_pred==1)).sum())
    fp=int(((y_true==0)&(y_pred==1)).sum())
    fn=int(((y_true==1)&(y_pred==0)).sum())
    tn=int(((y_true==0)&(y_pred==0)).sum())
    prec=tp/(tp+fp) if tp+fp>0 else 0
    rec=tp/(tp+fn) if tp+fn>0 else 0
    f1=2*prec*rec/(prec+rec) if prec+rec>0 else 0
    print("TP",tp,"FP",fp,"FN",fn,"TN",tn)
    print("Precision",prec,"Recall",rec,"F1",f1)

if __name__=="__main__":
    evaluate()
