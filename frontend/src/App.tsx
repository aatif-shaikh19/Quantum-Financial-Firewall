// frontend/src/App.tsx - Complete QFF Application
import React, { useState, useEffect } from "react";
import { Api, User } from "./services/api";
import { 
  Shield, Zap, LogOut, Users, BarChart3, History, 
  Send, UserPlus, Lock, Mail, User as UserIcon, 
  AlertCircle, CheckCircle, XCircle, Eye, EyeOff,
  Wallet, TrendingUp, Activity, Settings, RefreshCw
} from "lucide-react";
import "./index.css";

// ============ AUTH PAGES ============

interface AuthPageProps {
  onAuth: (user: User) => void;
}

function LoginPage({ onAuth }: AuthPageProps) {
  const [isLogin, setIsLogin] = useState(true);
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      if (isLogin) {
        const res = await Api.login(username, password);
        onAuth(res.user);
      } else {
        if (!email) {
          setError("Email is required");
          return;
        }
        const res = await Api.register(username, email, password);
        onAuth(res.user);
      }
    } catch (err: any) {
      setError(err.message || "Authentication failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 flex items-center justify-center p-4">
      {/* Background effects */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-cyan-500/20 rounded-full blur-3xl" />
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-purple-500/20 rounded-full blur-3xl" />
      </div>

      <div className="relative w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-gradient-to-br from-cyan-500 to-blue-600 shadow-lg shadow-cyan-500/30 mb-4">
            <Shield className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-white">Quantum Financial Firewall</h1>
          <p className="text-slate-400 mt-2">Agentic AI + Post-Quantum Cryptography</p>
        </div>

        {/* Auth Card */}
        <div className="bg-slate-800/80 backdrop-blur-xl rounded-2xl shadow-2xl border border-slate-700/50 p-8">
          <div className="flex mb-6">
            <button
              onClick={() => setIsLogin(true)}
              className={`flex-1 py-2 text-center font-medium transition-colors ${
                isLogin 
                  ? "text-cyan-400 border-b-2 border-cyan-400" 
                  : "text-slate-400 border-b border-slate-700 hover:text-white"
              }`}
            >
              Login
            </button>
            <button
              onClick={() => setIsLogin(false)}
              className={`flex-1 py-2 text-center font-medium transition-colors ${
                !isLogin 
                  ? "text-cyan-400 border-b-2 border-cyan-400" 
                  : "text-slate-400 border-b border-slate-700 hover:text-white"
              }`}
            >
              Register
            </button>
          </div>

          {error && (
            <div className="mb-4 p-3 bg-red-900/30 border border-red-700 rounded-lg flex items-center gap-2 text-red-300">
              <AlertCircle className="w-5 h-5 flex-shrink-0" />
              <span className="text-sm">{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                <UserIcon className="w-4 h-4 inline mr-2" />
                Username
              </label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
                minLength={3}
                className="w-full p-3 rounded-lg bg-slate-900/50 border border-slate-700 text-white placeholder-slate-500 focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-all"
                placeholder="Enter username"
              />
            </div>

            {!isLogin && (
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  <Mail className="w-4 h-4 inline mr-2" />
                  Email
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full p-3 rounded-lg bg-slate-900/50 border border-slate-700 text-white placeholder-slate-500 focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-all"
                  placeholder="you@example.com"
                />
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                <Lock className="w-4 h-4 inline mr-2" />
                Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  minLength={6}
                  className="w-full p-3 pr-10 rounded-lg bg-slate-900/50 border border-slate-700 text-white placeholder-slate-500 focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-all"
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white font-semibold rounded-lg transition-all shadow-lg shadow-cyan-500/25 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {loading ? (
                <RefreshCw className="w-5 h-5 animate-spin" />
              ) : isLogin ? (
                <>
                  <Lock className="w-5 h-5" />
                  Login
                </>
              ) : (
                <>
                  <UserPlus className="w-5 h-5" />
                  Create Account
                </>
              )}
            </button>
          </form>

          {/* Demo credentials */}
          <div className="mt-6 p-4 bg-slate-900/50 rounded-lg border border-slate-700">
            <p className="text-xs text-slate-400 mb-2">Demo Credentials:</p>
            <div className="grid grid-cols-2 gap-2 text-xs">
              <div className="text-slate-300">
                <span className="text-cyan-400">Admin:</span> admin / admin123
              </div>
              <div className="text-slate-300">
                <span className="text-cyan-400">User:</span> demo / demo123
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ============ MAIN DASHBOARD ============

interface DashboardProps {
  user: User;
  onLogout: () => void;
}

function Dashboard({ user, onLogout }: DashboardProps) {
  const [activeTab, setActiveTab] = useState<"dashboard" | "transactions" | "history" | "admin">("dashboard");
  const [balances, setBalances] = useState<any[]>([]);
  const [history, setHistory] = useState<any[]>([]);
  const [quantumStatus, setQuantumStatus] = useState<any>(null);
  const [adminStats, setAdminStats] = useState<any>(null);
  const [users, setUsers] = useState<any[]>([]);
  const [aiResult, setAiResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  // Transaction form state
  const [txType, setTxType] = useState("BANK_TRANSFER");
  const [amount, setAmount] = useState("");
  const [currency, setCurrency] = useState("USD");
  const [receiver, setReceiver] = useState("");

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [balanceRes, historyRes, quantumRes] = await Promise.all([
        Api.getBalance(),
        Api.history(50),
        Api.quantumStatus()
      ]);
      setBalances(balanceRes.balances || []);
      setHistory(historyRes.history || []);
      setQuantumStatus(quantumRes);

      if (user.role === "admin") {
        const [statsRes, usersRes] = await Promise.all([
          Api.getAdminStats(),
          Api.getUsers()
        ]);
        setAdminStats(statsRes);
        setUsers(usersRes.users || []);
      }
    } catch (err) {
      console.error("Failed to load data:", err);
    }
  };

  const handleAnalyze = async () => {
    if (!amount || !receiver) {
      alert("Please enter amount and receiver");
      return;
    }
    setLoading(true);
    try {
      const tx = { type: txType, amount: parseFloat(amount), currency, receiver };
      const result = await Api.analyze(tx);
      setAiResult(result);
    } catch (err: any) {
      alert("Analysis failed: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleExecute = async () => {
    if (!aiResult) {
      alert("Please analyze the transaction first");
      return;
    }
    setLoading(true);
    try {
      const tx = { type: txType, amount: parseFloat(amount), currency, receiver };
      const keyResult = await Api.quantumEstablish(0.0);
      
      if (keyResult.status === "INTERCEPTED") {
        alert("Quantum channel compromised! Transaction aborted.");
        return;
      }

      const result = await Api.execute(tx, keyResult.key, aiResult.score);
      alert(`Transaction executed!\nID: ${result.tx_id}\nFingerprint: ${result.fingerprint?.slice(0, 16)}...`);
      
      // Reset and reload
      setAmount("");
      setReceiver("");
      setAiResult(null);
      loadData();
    } catch (err: any) {
      alert("Execution failed: " + err.message);
    } finally {
      setLoading(false);
    }
  };

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

  const CURRENCIES = ["USD", "EUR", "GBP", "INR", "JPY", "BTC", "ETH", "USDT"];

  const getRiskColor = (score: number) => {
    if (score >= 85) return "text-green-400";
    if (score >= 70) return "text-yellow-400";
    if (score >= 50) return "text-orange-400";
    return "text-red-400";
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      {/* Header */}
      <header className="bg-slate-800/80 backdrop-blur-xl border-b border-slate-700/50 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center">
                <Shield className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-lg font-bold text-white">QFF Dashboard</h1>
                <p className="text-xs text-slate-400">Quantum Financial Firewall</p>
              </div>
            </div>

            <div className="flex items-center gap-4">
              {quantumStatus && (
                <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 bg-cyan-900/30 border border-cyan-700/50 rounded-full">
                  <Zap className="w-4 h-4 text-cyan-400" />
                  <span className="text-xs text-cyan-300">
                    {quantumStatus.pqc_mode === "real" ? "Real PQC" : "PQC Simulation"}
                  </span>
                </div>
              )}
              
              <div className="flex items-center gap-3 px-3 py-1.5 bg-slate-700/50 rounded-lg">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                  user.role === "admin" ? "bg-purple-600" : "bg-cyan-600"
                }`}>
                  <UserIcon className="w-4 h-4 text-white" />
                </div>
                <div className="hidden sm:block">
                  <p className="text-sm font-medium text-white">{user.username}</p>
                  <p className="text-xs text-slate-400 capitalize">{user.role}</p>
                </div>
              </div>

              <button
                onClick={onLogout}
                className="p-2 text-slate-400 hover:text-white hover:bg-slate-700 rounded-lg transition-colors"
                title="Logout"
              >
                <LogOut className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Navigation */}
      <nav className="bg-slate-800/50 border-b border-slate-700/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex gap-1 overflow-x-auto">
            <button
              onClick={() => setActiveTab("dashboard")}
              className={`flex items-center gap-2 px-4 py-3 text-sm font-medium transition-colors whitespace-nowrap ${
                activeTab === "dashboard"
                  ? "text-cyan-400 border-b-2 border-cyan-400"
                  : "text-slate-400 hover:text-white"
              }`}
            >
              <BarChart3 className="w-4 h-4" />
              Overview
            </button>
            <button
              onClick={() => setActiveTab("transactions")}
              className={`flex items-center gap-2 px-4 py-3 text-sm font-medium transition-colors whitespace-nowrap ${
                activeTab === "transactions"
                  ? "text-cyan-400 border-b-2 border-cyan-400"
                  : "text-slate-400 hover:text-white"
              }`}
            >
              <Send className="w-4 h-4" />
              New Transaction
            </button>
            <button
              onClick={() => setActiveTab("history")}
              className={`flex items-center gap-2 px-4 py-3 text-sm font-medium transition-colors whitespace-nowrap ${
                activeTab === "history"
                  ? "text-cyan-400 border-b-2 border-cyan-400"
                  : "text-slate-400 hover:text-white"
              }`}
            >
              <History className="w-4 h-4" />
              History
            </button>
            {user.role === "admin" && (
              <button
                onClick={() => setActiveTab("admin")}
                className={`flex items-center gap-2 px-4 py-3 text-sm font-medium transition-colors whitespace-nowrap ${
                  activeTab === "admin"
                    ? "text-purple-400 border-b-2 border-purple-400"
                    : "text-slate-400 hover:text-white"
                }`}
              >
                <Settings className="w-4 h-4" />
                Admin Panel
              </button>
            )}
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Dashboard Tab */}
        {activeTab === "dashboard" && (
          <div className="space-y-6">
            {/* Stats Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="bg-slate-800/60 backdrop-blur rounded-xl p-5 border border-slate-700/50">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-slate-400">Total Balance</p>
                    <p className="text-2xl font-bold text-white mt-1">
                      ${balances.reduce((sum, b) => sum + parseFloat(b.balance || "0"), 0).toLocaleString()}
                    </p>
                  </div>
                  <div className="w-12 h-12 rounded-xl bg-cyan-600/20 flex items-center justify-center">
                    <Wallet className="w-6 h-6 text-cyan-400" />
                  </div>
                </div>
              </div>

              <div className="bg-slate-800/60 backdrop-blur rounded-xl p-5 border border-slate-700/50">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-slate-400">Transactions</p>
                    <p className="text-2xl font-bold text-white mt-1">{history.length}</p>
                  </div>
                  <div className="w-12 h-12 rounded-xl bg-purple-600/20 flex items-center justify-center">
                    <TrendingUp className="w-6 h-6 text-purple-400" />
                  </div>
                </div>
              </div>

              <div className="bg-slate-800/60 backdrop-blur rounded-xl p-5 border border-slate-700/50">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-slate-400">Accounts</p>
                    <p className="text-2xl font-bold text-white mt-1">{balances.length}</p>
                  </div>
                  <div className="w-12 h-12 rounded-xl bg-green-600/20 flex items-center justify-center">
                    <Activity className="w-6 h-6 text-green-400" />
                  </div>
                </div>
              </div>

              <div className="bg-slate-800/60 backdrop-blur rounded-xl p-5 border border-slate-700/50">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-slate-400">Quantum Status</p>
                    <p className="text-lg font-bold text-cyan-400 mt-1">
                      {quantumStatus?.pqc_mode === "real" ? "Active" : "Simulation"}
                    </p>
                  </div>
                  <div className="w-12 h-12 rounded-xl bg-yellow-600/20 flex items-center justify-center">
                    <Zap className="w-6 h-6 text-yellow-400" />
                  </div>
                </div>
              </div>
            </div>

            {/* Accounts */}
            <div className="bg-slate-800/60 backdrop-blur rounded-xl border border-slate-700/50 overflow-hidden">
              <div className="px-6 py-4 border-b border-slate-700/50">
                <h3 className="text-lg font-semibold text-white flex items-center gap-2">
                  <Wallet className="w-5 h-5 text-cyan-400" />
                  Your Accounts
                </h3>
              </div>
              <div className="p-6">
                {balances.length === 0 ? (
                  <p className="text-slate-400 text-center py-8">No accounts found</p>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {balances.map((bal, i) => (
                      <div key={i} className="bg-slate-900/50 rounded-lg p-4 border border-slate-700/50">
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-2xl">
                            {bal.accountType === "CRYPTO" ? "₿" : bal.accountType === "CARD" ? "💳" : "🏦"}
                          </span>
                          <span className="text-xs px-2 py-1 bg-slate-700 rounded-full text-slate-300">
                            {bal.accountType}
                          </span>
                        </div>
                        <p className="text-xl font-bold text-white">
                          {bal.currency === "BTC" ? "₿" : bal.currency === "ETH" ? "Ξ" : "$"}
                          {parseFloat(bal.balance).toLocaleString()}
                        </p>
                        <p className="text-sm text-slate-400">{bal.currency}</p>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Recent Transactions */}
            <div className="bg-slate-800/60 backdrop-blur rounded-xl border border-slate-700/50 overflow-hidden">
              <div className="px-6 py-4 border-b border-slate-700/50 flex items-center justify-between">
                <h3 className="text-lg font-semibold text-white flex items-center gap-2">
                  <History className="w-5 h-5 text-cyan-400" />
                  Recent Transactions
                </h3>
                <button
                  onClick={() => setActiveTab("history")}
                  className="text-sm text-cyan-400 hover:text-cyan-300"
                >
                  View All →
                </button>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-slate-900/50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-slate-400 uppercase">Type</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-slate-400 uppercase">Amount</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-slate-400 uppercase">Receiver</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-slate-400 uppercase">Risk</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-slate-400 uppercase">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-700/50">
                    {history.slice(0, 5).map((tx, i) => (
                      <tr key={i} className="hover:bg-slate-700/20">
                        <td className="px-6 py-4 text-sm text-white">{tx.type}</td>
                        <td className="px-6 py-4 text-sm text-white">{tx.currency} {tx.amount}</td>
                        <td className="px-6 py-4 text-sm text-slate-300">{tx.receiver}</td>
                        <td className={`px-6 py-4 text-sm font-medium ${getRiskColor(tx.riskScore)}`}>
                          {tx.riskScore}/100
                        </td>
                        <td className="px-6 py-4">
                          <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${
                            tx.status === "COMPLETED" 
                              ? "bg-green-900/30 text-green-400" 
                              : "bg-red-900/30 text-red-400"
                          }`}>
                            {tx.status === "COMPLETED" ? <CheckCircle className="w-3 h-3" /> : <XCircle className="w-3 h-3" />}
                            {tx.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                {history.length === 0 && (
                  <p className="text-slate-400 text-center py-8">No transactions yet</p>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Transactions Tab */}
        {activeTab === "transactions" && (
          <div className="max-w-4xl mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Transaction Form */}
              <div className="bg-slate-800/60 backdrop-blur rounded-xl border border-slate-700/50 p-6">
                <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                  <Send className="w-6 h-6 text-cyan-400" />
                  Create Transaction
                </h3>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-2">Transaction Type</label>
                    <select
                      value={txType}
                      onChange={(e) => setTxType(e.target.value)}
                      className="w-full p-3 bg-slate-900/50 border border-slate-700 rounded-lg text-white focus:ring-2 focus:ring-cyan-500"
                    >
                      {TRANSACTION_TYPES.map((type) => (
                        <option key={type.value} value={type.value}>
                          {type.icon} {type.label}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-slate-300 mb-2">Amount</label>
                      <input
                        type="number"
                        value={amount}
                        onChange={(e) => setAmount(e.target.value)}
                        placeholder="0.00"
                        className="w-full p-3 bg-slate-900/50 border border-slate-700 rounded-lg text-white focus:ring-2 focus:ring-cyan-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-300 mb-2">Currency</label>
                      <select
                        value={currency}
                        onChange={(e) => setCurrency(e.target.value)}
                        className="w-full p-3 bg-slate-900/50 border border-slate-700 rounded-lg text-white focus:ring-2 focus:ring-cyan-500"
                      >
                        {CURRENCIES.map((c) => (
                          <option key={c} value={c}>{c}</option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-2">Receiver</label>
                    <input
                      type="text"
                      value={receiver}
                      onChange={(e) => setReceiver(e.target.value)}
                      placeholder="recipient@example.com or wallet address"
                      className="w-full p-3 bg-slate-900/50 border border-slate-700 rounded-lg text-white focus:ring-2 focus:ring-cyan-500"
                    />
                  </div>

                  <div className="flex gap-3 pt-2">
                    <button
                      onClick={handleAnalyze}
                      disabled={loading || !amount || !receiver}
                      className="flex-1 py-3 bg-slate-700 hover:bg-slate-600 text-white font-medium rounded-lg transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
                    >
                      {loading ? <RefreshCw className="w-5 h-5 animate-spin" /> : <Activity className="w-5 h-5" />}
                      Analyze with AI
                    </button>
                    <button
                      onClick={handleExecute}
                      disabled={loading || !aiResult}
                      className="flex-1 py-3 bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white font-medium rounded-lg transition-all disabled:opacity-50 flex items-center justify-center gap-2"
                    >
                      {loading ? <RefreshCw className="w-5 h-5 animate-spin" /> : <Zap className="w-5 h-5" />}
                      Execute Secure
                    </button>
                  </div>
                </div>
              </div>

              {/* AI Analysis Result */}
              <div className="bg-slate-800/60 backdrop-blur rounded-xl border border-slate-700/50 p-6">
                <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                  <Activity className="w-6 h-6 text-purple-400" />
                  AI Risk Analysis
                </h3>

                {!aiResult ? (
                  <div className="text-center py-12">
                    <div className="w-16 h-16 rounded-full bg-slate-700/50 flex items-center justify-center mx-auto mb-4">
                      <Shield className="w-8 h-8 text-slate-500" />
                    </div>
                    <p className="text-slate-400">Click "Analyze with AI" to get risk assessment</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div className={`text-center p-6 rounded-xl ${
                      aiResult.score >= 85 ? "bg-green-900/30 border border-green-700/50" :
                      aiResult.score >= 70 ? "bg-yellow-900/30 border border-yellow-700/50" :
                      aiResult.score >= 50 ? "bg-orange-900/30 border border-orange-700/50" :
                      "bg-red-900/30 border border-red-700/50"
                    }`}>
                      <p className="text-sm text-slate-300 mb-1">Safety Score</p>
                      <p className={`text-5xl font-bold ${getRiskColor(aiResult.score)}`}>
                        {aiResult.score}
                      </p>
                      <p className="text-sm text-slate-400 mt-1">out of 100</p>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div className="bg-slate-900/50 rounded-lg p-3">
                        <p className="text-xs text-slate-400">Risk Level</p>
                        <p className="text-sm font-medium text-white">{aiResult.riskLevel || "N/A"}</p>
                      </div>
                      <div className="bg-slate-900/50 rounded-lg p-3">
                        <p className="text-xs text-slate-400">Recommendation</p>
                        <p className={`text-sm font-medium ${
                          aiResult.recommendation === "APPROVE" ? "text-green-400" : "text-red-400"
                        }`}>
                          {aiResult.recommendation || "N/A"}
                        </p>
                      </div>
                    </div>

                    {aiResult.factors && (
                      <div className="bg-slate-900/50 rounded-lg p-4">
                        <p className="text-xs text-slate-400 mb-2">Risk Factors</p>
                        <ul className="space-y-1">
                          {aiResult.factors.map((f: string, i: number) => (
                            <li key={i} className="text-sm text-slate-300 flex items-center gap-2">
                              <span className="w-1.5 h-1.5 rounded-full bg-cyan-400" />
                              {f}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* History Tab */}
        {activeTab === "history" && (
          <div className="bg-slate-800/60 backdrop-blur rounded-xl border border-slate-700/50 overflow-hidden">
            <div className="px-6 py-4 border-b border-slate-700/50 flex items-center justify-between">
              <h3 className="text-lg font-semibold text-white flex items-center gap-2">
                <History className="w-5 h-5 text-cyan-400" />
                Transaction History
              </h3>
              <button
                onClick={loadData}
                className="text-sm text-cyan-400 hover:text-cyan-300 flex items-center gap-1"
              >
                <RefreshCw className="w-4 h-4" />
                Refresh
              </button>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-slate-900/50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-slate-400 uppercase">ID</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-slate-400 uppercase">Time</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-slate-400 uppercase">Type</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-slate-400 uppercase">Amount</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-slate-400 uppercase">Receiver</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-slate-400 uppercase">Risk</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-slate-400 uppercase">Quantum Key</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-slate-400 uppercase">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-700/50">
                  {history.map((tx, i) => (
                    <tr key={i} className="hover:bg-slate-700/20">
                      <td className="px-6 py-4 text-xs text-slate-400 font-mono">{tx.id?.slice(0, 8)}...</td>
                      <td className="px-6 py-4 text-sm text-slate-300">{new Date(tx.timestamp).toLocaleString()}</td>
                      <td className="px-6 py-4 text-sm text-white">{tx.type}</td>
                      <td className="px-6 py-4 text-sm text-white font-medium">{tx.currency} {tx.amount}</td>
                      <td className="px-6 py-4 text-sm text-slate-300">{tx.receiver}</td>
                      <td className={`px-6 py-4 text-sm font-medium ${getRiskColor(tx.riskScore)}`}>
                        {tx.riskScore}/100
                      </td>
                      <td className="px-6 py-4 text-xs text-cyan-400 font-mono">{tx.quantumKeySnippet || "N/A"}</td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${
                          tx.status === "COMPLETED" 
                            ? "bg-green-900/30 text-green-400" 
                            : "bg-red-900/30 text-red-400"
                        }`}>
                          {tx.status === "COMPLETED" ? <CheckCircle className="w-3 h-3" /> : <XCircle className="w-3 h-3" />}
                          {tx.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {history.length === 0 && (
                <p className="text-slate-400 text-center py-12">No transactions found</p>
              )}
            </div>
          </div>
        )}

        {/* Admin Tab */}
        {activeTab === "admin" && user.role === "admin" && (
          <div className="space-y-6">
            {/* Admin Stats */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="bg-purple-900/30 backdrop-blur rounded-xl p-5 border border-purple-700/50">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-purple-300">Total Users</p>
                    <p className="text-3xl font-bold text-white mt-1">{adminStats?.total_users || 0}</p>
                  </div>
                  <Users className="w-10 h-10 text-purple-400" />
                </div>
              </div>
              <div className="bg-purple-900/30 backdrop-blur rounded-xl p-5 border border-purple-700/50">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-purple-300">Total Transactions</p>
                    <p className="text-3xl font-bold text-white mt-1">{adminStats?.total_transactions || 0}</p>
                  </div>
                  <TrendingUp className="w-10 h-10 text-purple-400" />
                </div>
              </div>
              <div className="bg-purple-900/30 backdrop-blur rounded-xl p-5 border border-purple-700/50">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-purple-300">Total Accounts</p>
                    <p className="text-3xl font-bold text-white mt-1">{adminStats?.total_accounts || 0}</p>
                  </div>
                  <Wallet className="w-10 h-10 text-purple-400" />
                </div>
              </div>
            </div>

            {/* User Management */}
            <div className="bg-slate-800/60 backdrop-blur rounded-xl border border-slate-700/50 overflow-hidden">
              <div className="px-6 py-4 border-b border-slate-700/50">
                <h3 className="text-lg font-semibold text-white flex items-center gap-2">
                  <Users className="w-5 h-5 text-purple-400" />
                  User Management
                </h3>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-slate-900/50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-slate-400 uppercase">User</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-slate-400 uppercase">Email</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-slate-400 uppercase">Role</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-slate-400 uppercase">Status</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-slate-400 uppercase">Last Login</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-slate-400 uppercase">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-700/50">
                    {users.map((u, i) => (
                      <tr key={i} className="hover:bg-slate-700/20">
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                              u.role === "admin" ? "bg-purple-600" : "bg-cyan-600"
                            }`}>
                              <UserIcon className="w-4 h-4 text-white" />
                            </div>
                            <span className="text-sm font-medium text-white">{u.username}</span>
                          </div>
                        </td>
                        <td className="px-6 py-4 text-sm text-slate-300">{u.email}</td>
                        <td className="px-6 py-4">
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                            u.role === "admin" 
                              ? "bg-purple-900/50 text-purple-300" 
                              : "bg-slate-700 text-slate-300"
                          }`}>
                            {u.role}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                            u.is_active 
                              ? "bg-green-900/30 text-green-400" 
                              : "bg-red-900/30 text-red-400"
                          }`}>
                            {u.is_active ? "Active" : "Disabled"}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-sm text-slate-400">
                          {u.last_login ? new Date(u.last_login).toLocaleString() : "Never"}
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex gap-2">
                            <button
                              onClick={async () => {
                                const newRole = u.role === "admin" ? "user" : "admin";
                                await Api.updateUser(u.id, { role: newRole });
                                loadData();
                              }}
                              className="text-xs px-2 py-1 bg-slate-700 hover:bg-slate-600 text-slate-300 rounded"
                            >
                              Toggle Role
                            </button>
                            <button
                              onClick={async () => {
                                await Api.updateUser(u.id, { is_active: !u.is_active });
                                loadData();
                              }}
                              className="text-xs px-2 py-1 bg-slate-700 hover:bg-slate-600 text-slate-300 rounded"
                            >
                              {u.is_active ? "Disable" : "Enable"}
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

// ============ MAIN APP ============

export default function App() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check for existing session
    if (Api.isLoggedIn()) {
      Api.getMe()
        .then(setUser)
        .catch(() => Api.logout())
        .finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, []);

  const handleLogout = () => {
    Api.logout();
    setUser(null);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center">
        <div className="flex items-center gap-3">
          <RefreshCw className="w-6 h-6 text-cyan-400 animate-spin" />
          <span className="text-white">Loading...</span>
        </div>
      </div>
    );
  }

  if (!user) {
    return <LoginPage onAuth={setUser} />;
  }

  return <Dashboard user={user} onLogout={handleLogout} />;
}
