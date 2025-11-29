// frontend/src/components/TransactionForm.tsx
import React, { useState } from "react";
import { Shield, AlertTriangle, CheckCircle } from "lucide-react";

interface TransactionFormProps {
  onSubmit: (tx: any) => void;
  onAnalyze: (tx: any) => void;
  aiResult?: any;
}

const TRANSACTION_TYPES = [
  { value: "BANK_TRANSFER", label: "Bank Transfer", icon: "🏦" },
  { value: "UPI_PAYMENT", label: "UPI Payment", icon: "📱" },
  { value: "CARD_PAYMENT", label: "Card Payment", icon: "💳" },
  { value: "CRYPTO_TRANSFER", label: "Crypto Transfer", icon: "₿" },
  { value: "SMART_CONTRACT", label: "Smart Contract", icon: "📜" },
  { value: "FOREX_PAYMENT", label: "Forex Payment", icon: "💱" },
  { value: "WIRE_TRANSFER", label: "Wire Transfer", icon: "🔌" },
  { value: "ACH_TRANSFER", label: "ACH Transfer", icon: "🔄" },
  { value: "SEPA_TRANSFER", label: "SEPA Transfer", icon: "🇪🇺" },
  { value: "SWIFT_PAYMENT", label: "SWIFT Payment", icon: "🌍" }
];

const CURRENCIES = [
  "INR", "USD", "EUR", "GBP", "JPY", "CNY", "SAR", "AED",
  "BTC", "ETH", "USDT", "USDC", "SOL", "XRP"
];

export default function TransactionForm({ onSubmit, onAnalyze, aiResult }: TransactionFormProps) {
  const [txType, setTxType] = useState("BANK_TRANSFER");
  const [amount, setAmount] = useState("");
  const [currency, setCurrency] = useState("INR");
  const [receiver, setReceiver] = useState("");
  const [details, setDetails] = useState("");
  const [loading, setLoading] = useState(false);

  const handleAnalyze = async () => {
    if (!amount || !receiver) {
      alert("Please enter amount and receiver");
      return;
    }

    const tx = {
      type: txType,
      amount,
      currency,
      receiver,
      details: details ? JSON.parse(details) : {}
    };

    setLoading(true);
    try {
      await onAnalyze(tx);
    } finally {
      setLoading(false);
    }
  };

  const handleExecute = async () => {
    if (!amount || !receiver) {
      alert("Please enter amount and receiver");
      return;
    }

    const tx = {
      type: txType,
      amount,
      currency,
      receiver,
      details: details ? JSON.parse(details) : {}
    };

    setLoading(true);
    try {
      await onSubmit(tx);
    } finally {
      setLoading(false);
    }
  };

  const getRiskColor = () => {
    if (!aiResult) return "gray";
    const score = aiResult.score || 0;
    if (score >= 85) return "green";
    if (score >= 70) return "yellow";
    if (score >= 50) return "orange";
    return "red";
  };

  const riskColor = getRiskColor();

  return (
    <div className="bg-slate-800 p-6 rounded-lg shadow-xl">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-bold text-white flex items-center gap-2">
          <Shield className="w-6 h-6 text-cyan-400" />
          Create Transaction
        </h3>
        {aiResult && (
          <div className={`flex items-center gap-2 px-3 py-1 rounded-full ${
            riskColor === 'green' ? 'bg-green-900 text-green-300' :
            riskColor === 'yellow' ? 'bg-yellow-900 text-yellow-300' :
            riskColor === 'orange' ? 'bg-orange-900 text-orange-300' :
            'bg-red-900 text-red-300'
          }`}>
            {riskColor === 'green' ? <CheckCircle className="w-4 h-4" /> : 
             <AlertTriangle className="w-4 h-4" />}
            <span className="text-sm font-semibold">
              Safety: {aiResult.score}/100
            </span>
          </div>
        )}
      </div>

      <div className="space-y-4">
        {/* Transaction Type */}
        <div>
          <label className="block text-sm font-medium text-slate-300 mb-2">
            Transaction Type
          </label>
          <select
            value={txType}
            onChange={(e) => setTxType(e.target.value)}
            className="w-full p-3 bg-slate-900 border border-slate-700 rounded-lg text-white focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
          >
            {TRANSACTION_TYPES.map((type) => (
              <option key={type.value} value={type.value}>
                {type.icon} {type.label}
              </option>
            ))}
          </select>
        </div>

        {/* Amount and Currency */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">
              Amount
            </label>
            <input
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="0.00"
              className="w-full p-3 bg-slate-900 border border-slate-700 rounded-lg text-white focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">
              Currency
            </label>
            <select
              value={currency}
              onChange={(e) => setCurrency(e.target.value)}
              className="w-full p-3 bg-slate-900 border border-slate-700 rounded-lg text-white focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
            >
              {CURRENCIES.map((cur) => (
                <option key={cur} value={cur}>
                  {cur}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Receiver */}
        <div>
          <label className="block text-sm font-medium text-slate-300 mb-2">
            Receiver
          </label>
          <input
            type="text"
            value={receiver}
            onChange={(e) => setReceiver(e.target.value)}
            placeholder="account@bank.com or wallet address"
            className="w-full p-3 bg-slate-900 border border-slate-700 rounded-lg text-white focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
          />
        </div>

        {/* Details (Optional) */}
        <div>
          <label className="block text-sm font-medium text-slate-300 mb-2">
            Details (Optional JSON)
          </label>
          <textarea
            value={details}
            onChange={(e) => setDetails(e.target.value)}
            placeholder='{"note": "payment description"}'
            rows={2}
            className="w-full p-3 bg-slate-900 border border-slate-700 rounded-lg text-white focus:ring-2 focus:ring-cyan-500 focus:border-transparent font-mono text-sm"
          />
        </div>

        {/* Action Buttons */}
        <div className="flex gap-3 pt-4">
          <button
            onClick={handleAnalyze}
            disabled={loading || !amount || !receiver}
            className="flex-1 px-4 py-3 bg-cyan-600 hover:bg-cyan-700 disabled:bg-slate-700 disabled:cursor-not-allowed text-white font-semibold rounded-lg transition-colors flex items-center justify-center gap-2"
          >
            <Shield className="w-5 h-5" />
            {loading ? "Analyzing..." : "AI Analyze"}
          </button>
          
          <button
            onClick={handleExecute}
            disabled={loading || !amount || !receiver || !aiResult}
            className="flex-1 px-4 py-3 bg-green-600 hover:bg-green-700 disabled:bg-slate-700 disabled:cursor-not-allowed text-white font-semibold rounded-lg transition-colors flex items-center justify-center gap-2"
          >
            <CheckCircle className="w-5 h-5" />
            {loading ? "Executing..." : "Execute"}
          </button>
        </div>
      </div>

      {aiResult && aiResult.recommendation === "BLOCK" && (
        <div className="mt-4 p-4 bg-red-900/30 border border-red-700 rounded-lg">
          <div className="flex items-center gap-2 text-red-300">
            <AlertTriangle className="w-5 h-5" />
            <span className="font-semibold">High Risk Detected</span>
          </div>
          <p className="text-sm text-red-200 mt-2">
            This transaction has been flagged as high risk. Execution is not recommended.
          </p>
        </div>
      )}
    </div>
  );
}
