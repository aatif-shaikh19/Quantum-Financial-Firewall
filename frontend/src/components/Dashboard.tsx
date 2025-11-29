import React, { useEffect, useState } from "react";
import { Api } from "../services/api";

export default function Dashboard() {
  const [loggedIn, setLoggedIn] = useState(false);
  const [username, setUsername] = useState("demo");
  const [balances, setBalances] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [txType, setTxType] = useState("BANK_TRANSFER");
  const [amount, setAmount] = useState("");
  const [currency, setCurrency] = useState("INR");
  const [receiver, setReceiver] = useState("");
  const [analysis, setAnalysis] = useState<any>(null);
  const [demoSeed, setDemoSeed] = useState<number>(1234);
  const [demoMode, setDemoMode] = useState(true);

  useEffect(() => {
    if (loggedIn) fetchBalances();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [loggedIn]);

  const fetchBalances = async () => {
    setLoading(true);
    try {
      const data = await Api.getBalance("user-1");
      setBalances(data.balances || []);
    } catch (err) {
      console.error(err);
      alert("Failed to load balances");
    } finally {
      setLoading(false);
    }
  };

  const handleLogin = () => {
    setLoggedIn(true);
  };

  const submitAnalyze = async () => {
    if (!amount || !receiver) { alert("Enter amount and receiver"); return; }
    const tx = { type: txType, amount, currency, receiver, details: {} };
    setAnalysis(null);
    try {
      const res = await Api.analyze(tx);
      setAnalysis(res);
    } catch (err) {
      console.error(err);
      alert("Analyze call failed");
    }
  };

  return (
    <div className="p-8 max-w-4xl mx-auto">
      {!loggedIn ? (
        <div className="bg-slate-800 p-8 rounded-lg">
          <h2 className="text-xl font-bold mb-4">QFF — Demo Login</h2>
          <div className="mb-4">
            <label className="block text-sm mb-1">Username</label>
            <input className="w-full p-2 rounded bg-slate-900" value={username} onChange={(e)=>setUsername(e.target.value)} />
          </div>
          <button onClick={handleLogin} className="px-4 py-2 bg-cyan-600 rounded">Login</button>
        </div>
      ) : (
        <>
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold">Welcome, {username}</h2>
            <div>
              <label className="text-sm mr-2">Demo Mode</label>
              <input type="checkbox" checked={demoMode} onChange={(e)=>setDemoMode(e.target.checked)} />
            </div>
          </div>

          <div className="bg-slate-800 p-6 rounded mb-6">
            <h3 className="font-semibold mb-3">Accounts & Balances</h3>
            {loading ? <p>Loading...</p> : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {balances.map((b:any) => (
                  <div className="p-3 bg-slate-900 rounded" key={b.accountId}>
                    <div className="text-sm text-slate-400">{b.accountType} • {b.accountId}</div>
                    <div className="text-lg font-mono">{b.balance} {b.currency}</div>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="bg-slate-800 p-6 rounded">
            <h3 className="font-semibold mb-3">Create Transaction (Demo)</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-3">
              <select value={txType} onChange={(e)=>setTxType(e.target.value)} className="p-2 rounded bg-slate-900">
                <option value="BANK_TRANSFER">Bank Transfer</option>
                <option value="UPI_PAYMENT">UPI Payment</option>
                <option value="CRYPTO_TRANSFER">Crypto Transfer</option>
                <option value="SMART_CONTRACT">Smart Contract</option>
              </select>
              <input placeholder="Amount" value={amount} onChange={(e)=>setAmount(e.target.value)} className="p-2 rounded bg-slate-900" />
              <select value={currency} onChange={(e)=>setCurrency(e.target.value)} className="p-2 rounded bg-slate-900">
                <option>INR</option>
                <option>SAR</option>
                <option>USD</option>
                <option>BTC</option>
                <option>ETH</option>
              </select>
            </div>

            <div className="mb-3">
              <input placeholder="Receiver" value={receiver} onChange={(e)=>setReceiver(e.target.value)} className="w-full p-2 rounded bg-slate-900" />
            </div>

            <div className="flex space-x-2">
              <button onClick={submitAnalyze} className="px-4 py-2 bg-cyan-600 rounded">Analyze</button>
            </div>

            {analysis && (
              <div className="mt-4 bg-slate-700 p-3 rounded">
                <div><strong>Score:</strong> {analysis.score} / 100</div>
                <div><strong>Risk Level:</strong> {analysis.riskLevel}</div>
                <div><strong>Recommendation:</strong> {analysis.recommendation}</div>
                <div className="mt-2"><strong>Factors</strong>
                  <ul className="list-disc ml-5">
                    {analysis.factors.map((f:any, i:number)=> <li key={i}>{f}</li>)}
                  </ul>
                </div>
              </div>
            )}
          </div>

        </>
      )}
    </div>
  );
}
