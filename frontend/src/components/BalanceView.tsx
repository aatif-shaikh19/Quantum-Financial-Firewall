// frontend/src/components/BalanceView.tsx
import React from "react";
import { Wallet, TrendingUp, DollarSign } from "lucide-react";

interface Balance {
  accountId: string;
  accountType: string;
  currency: string;
  balance: string;
}

interface BalanceViewProps {
  balances: Balance[];
  loading?: boolean;
}

const getAccountIcon = (type: string) => {
  switch (type) {
    case "CRYPTO":
      return "₿";
    case "UPI":
      return "📱";
    case "CARD":
      return "💳";
    case "WALLET":
      return "👛";
    default:
      return "🏦";
  }
};

const getCurrencySymbol = (currency: string) => {
  const symbols: Record<string, string> = {
    INR: "₹",
    USD: "$",
    EUR: "€",
    GBP: "£",
    JPY: "¥",
    SAR: "﷼",
    BTC: "₿",
    ETH: "Ξ"
  };
  return symbols[currency] || currency;
};

export default function BalanceView({ balances, loading }: BalanceViewProps) {
  if (loading) {
    return (
      <div className="bg-slate-800 p-6 rounded-lg shadow-xl">
        <div className="flex items-center gap-2 mb-4">
          <Wallet className="w-5 h-5 text-cyan-400" />
          <h3 className="text-lg font-semibold text-white">Accounts & Balances</h3>
        </div>
        <div className="text-slate-400">Loading balances...</div>
      </div>
    );
  }

  if (balances.length === 0) {
    return (
      <div className="bg-slate-800 p-6 rounded-lg shadow-xl">
        <div className="flex items-center gap-2 mb-4">
          <Wallet className="w-5 h-5 text-cyan-400" />
          <h3 className="text-lg font-semibold text-white">Accounts & Balances</h3>
        </div>
        <div className="text-slate-400">No accounts found</div>
      </div>
    );
  }

  // Group balances by account type
  const groupedBalances = balances.reduce((acc, balance) => {
    const type = balance.accountType;
    if (!acc[type]) acc[type] = [];
    acc[type].push(balance);
    return acc;
  }, {} as Record<string, Balance[]>);

  return (
    <div className="bg-slate-800 p-6 rounded-lg shadow-xl">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <Wallet className="w-5 h-5 text-cyan-400" />
          <h3 className="text-lg font-semibold text-white">Accounts & Balances</h3>
        </div>
        <div className="flex items-center gap-1 text-sm text-slate-400">
          <TrendingUp className="w-4 h-4" />
          <span>{balances.length} accounts</span>
        </div>
      </div>

      <div className="space-y-4">
        {Object.entries(groupedBalances).map(([type, accounts]) => (
          <div key={type}>
            <div className="text-xs font-semibold text-slate-400 mb-2 uppercase tracking-wide">
              {type}
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
              {accounts.map((balance) => (
                <div
                  key={balance.accountId}
                  className="bg-slate-900 p-4 rounded-lg border border-slate-700 hover:border-cyan-500 transition-colors"
                >
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <span className="text-2xl">{getAccountIcon(balance.accountType)}</span>
                      <div>
                        <div className="text-xs text-slate-400">{balance.accountId}</div>
                      </div>
                    </div>
                    <div className="text-xs text-slate-500">{balance.currency}</div>
                  </div>
                  <div className="flex items-baseline gap-1">
                    <span className="text-xs text-slate-400">{getCurrencySymbol(balance.currency)}</span>
                    <span className="text-xl font-bold text-white font-mono">
                      {parseFloat(balance.balance).toLocaleString(undefined, {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 8
                      })}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
