import React, { useEffect, useState } from "react";
import { Api } from "../lib/api";
import { CURRENCIES, TX_TYPES } from "../lib/constants";
import AIResultPanel from "../components/AIResultPanel";
import QKDFlow from "../components/QuantumPanel";

export default function Dashboard() {
  const [balances, setBalances] = useState<any[]>([]);
  const [txType, setTxType] = useState("BANK_TRANSFER");
  const [amount, setAmount] = useState("");
  const [currency, setCurrency] = useState("INR");
  const [receiver, setReceiver] = useState("");
  const [aiResult, setAiResult] = useState<any | null>(null);
  const [txPayload, setTxPayload] = useState<any | null>(null);
  const [history, setHistory] = useState<any[]>([]);
  const [autoProtect, setAutoProtect] = useState(true);

  useEffect(() => { fetchBalances(); fetchHistory(); }, []);

  async function fetchBalances() { try { const res = await Api.getBalance(); setBalances(res.balances || []); } catch (e) { console.error(e) } }
  async function fetchHistory() { try { const res = await Api.history(); setHistory(res.history || []); } catch (e) { console.error(e) } }

  async function handleAnalyze() {
    if (!amount || !receiver) return alert("Fill amount & receiver");
    const tx = { type: txType, amount, currency, receiver, details: {} };
    setTxPayload(tx);
    try { const res = await Api.analyze(tx); setAiResult(res); } catch (e: any) { alert("Analyze failed: " + e.message) }
  }

  return (
    <div className="container">
      <div className="card" style={{ display: 'flex', gap: 16 }}>
        <div style={{ flex: 2 }}>
          <h2>QFF Demo — Transaction Gateway</h2>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr 1fr', gap: 8, marginTop: 12 }}>
            <select className="input" value={txType} onChange={e => setTxType(e.target.value)}>
              {TX_TYPES.map(t => <option key={t}>{t}</option>)}
            </select>
            <input className="input" placeholder="Amount" value={amount} onChange={e => setAmount(e.target.value)} />
            <select className="input" value={currency} onChange={e => setCurrency(e.target.value)}>
              {CURRENCIES.map(c => <option key={c}>{c}</option>)}
            </select>
            <input className="input" placeholder="Receiver" value={receiver} onChange={e => setReceiver(e.target.value)} />
          </div>

          <div style={{ marginTop: 12, display: 'flex', alignItems: 'center', gap: 8 }}>
            <button className="btn" onClick={handleAnalyze}>INITIALIZE SECURITY SCAN</button>
            <label style={{ display: 'flex', alignItems: 'center', gap: 6, color: '#94a3b8', fontSize: 14 }}>
              <input type="checkbox" checked={autoProtect} onChange={e => setAutoProtect(e.target.checked)} />
              Auto-Protect Mode
            </label>
          </div>

          <div style={{ marginTop: 16 }}>
            <AIResultPanel aiResult={aiResult} />
            {aiResult && txPayload && <QKDFlow txPayload={txPayload} aiResult={aiResult} autoProtect={autoProtect} onSuccess={() => { fetchHistory(); setAiResult(null); setAmount(""); setReceiver(""); }} />}
          </div>
        </div>

        <aside style={{ flex: 1 }}>
          <h4>Accounts</h4>
          {balances.map(b => (
            <div key={b.accountId} style={{ padding: 8, marginBottom: 8, background: "#081021", borderRadius: 8 }}>
              <div style={{ fontSize: 12, color: "#9aa6b2" }}>{b.accountType} • {b.accountId}</div>
              <div style={{ fontWeight: 700 }}>{b.balance} {b.currency}</div>
            </div>
          ))}
          <h4 style={{ marginTop: 12 }}>Recent Ledger</h4>
          <div style={{ maxHeight: 300, overflow: "auto" }}>
            {history.slice(0, 10).map(h => (
              <div key={h.id} style={{ padding: 8, marginBottom: 8, background: "#071427", borderRadius: 8 }}>
                <div style={{ fontSize: 12, color: "#9aa6b2" }}>{h.type} • {h.currency}</div>
                <div style={{ fontFamily: "monospace" }}>{h.amount} • {h.receiver}</div>
                <div style={{ fontSize: 12, color: h.status === "COMPLETED" ? "#68d391" : "#f56565" }}>{h.status}</div>
              </div>
            ))}
          </div>
        </aside>
      </div>
    </div>
  );
}
