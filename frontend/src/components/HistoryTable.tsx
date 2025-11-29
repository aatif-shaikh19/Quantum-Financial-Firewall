// frontend/src/components/HistoryTable.tsx
import React from "react";
import { Clock, CheckCircle, XCircle, AlertTriangle } from "lucide-react";

interface Transaction {
  id: string;
  timestamp: string;
  type: string;
  amount: string;
  currency: string;
  receiver: string;
  riskScore: number;
  status: string;
  quantumKeySnippet?: string;
}

interface HistoryTableProps {
  transactions: Transaction[];
  loading?: boolean;
}

const getStatusIcon = (status: string) => {
  switch (status.toUpperCase()) {
    case "COMPLETED":
      return <CheckCircle className="w-4 h-4 text-green-400" />;
    case "FAILED":
      return <XCircle className="w-4 h-4 text-red-400" />;
    case "PENDING":
      return <Clock className="w-4 h-4 text-yellow-400" />;
    default:
      return <AlertTriangle className="w-4 h-4 text-slate-400" />;
  }
};

const getRiskColor = (score: number) => {
  if (score >= 85) return "text-green-400";
  if (score >= 70) return "text-yellow-400";
  if (score >= 50) return "text-orange-400";
  return "text-red-400";
};

const formatTimestamp = (timestamp: string) => {
  try {
    const date = new Date(timestamp);
    return date.toLocaleString();
  } catch {
    return timestamp;
  }
};

export default function HistoryTable({ transactions, loading }: HistoryTableProps) {
  if (loading) {
    return (
      <div className="bg-slate-800 p-6 rounded-lg shadow-xl">
        <h3 className="text-lg font-semibold text-white mb-4">Transaction History</h3>
        <div className="text-slate-400">Loading history...</div>
      </div>
    );
  }

  if (transactions.length === 0) {
    return (
      <div className="bg-slate-800 p-6 rounded-lg shadow-xl">
        <h3 className="text-lg font-semibold text-white mb-4">Transaction History</h3>
        <div className="text-slate-400 text-center py-8">No transactions yet</div>
      </div>
    );
  }

  return (
    <div className="bg-slate-800 p-6 rounded-lg shadow-xl">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-white">Transaction History</h3>
        <div className="text-sm text-slate-400">{transactions.length} transactions</div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="text-left text-xs font-semibold text-slate-400 border-b border-slate-700">
              <th className="pb-3 pr-4">Status</th>
              <th className="pb-3 pr-4">ID</th>
              <th className="pb-3 pr-4">Type</th>
              <th className="pb-3 pr-4">Amount</th>
              <th className="pb-3 pr-4">Receiver</th>
              <th className="pb-3 pr-4">Risk</th>
              <th className="pb-3 pr-4">Timestamp</th>
              <th className="pb-3">Quantum</th>
            </tr>
          </thead>
          <tbody className="text-sm">
            {transactions.map((tx) => (
              <tr
                key={tx.id}
                className="border-b border-slate-700 hover:bg-slate-750 transition-colors"
              >
                <td className="py-3 pr-4">
                  <div className="flex items-center gap-2">
                    {getStatusIcon(tx.status)}
                    <span className="text-xs text-slate-400">{tx.status}</span>
                  </div>
                </td>
                <td className="py-3 pr-4">
                  <span className="font-mono text-xs text-slate-300">{tx.id}</span>
                </td>
                <td className="py-3 pr-4">
                  <span className="text-slate-300">{tx.type.replace(/_/g, " ")}</span>
                </td>
                <td className="py-3 pr-4">
                  <div className="flex items-baseline gap-1">
                    <span className="font-mono font-semibold text-white">
                      {parseFloat(tx.amount).toLocaleString(undefined, {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 8
                      })}
                    </span>
                    <span className="text-xs text-slate-400">{tx.currency}</span>
                  </div>
                </td>
                <td className="py-3 pr-4">
                  <span className="text-slate-300 truncate max-w-xs block">
                    {tx.receiver}
                  </span>
                </td>
                <td className="py-3 pr-4">
                  <span className={`font-semibold ${getRiskColor(tx.riskScore)}`}>
                    {tx.riskScore}
                  </span>
                </td>
                <td className="py-3 pr-4 text-slate-400 text-xs">
                  {formatTimestamp(tx.timestamp)}
                </td>
                <td className="py-3">
                  {tx.quantumKeySnippet && (
                    <span className="font-mono text-xs text-cyan-400">
                      {tx.quantumKeySnippet}
                    </span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
