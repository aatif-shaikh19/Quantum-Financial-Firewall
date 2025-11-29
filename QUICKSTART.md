# QFF Quick Start Guide

## 🚀 5-Minute Setup

### Step 1: Install Dependencies (First Time Only)

**Backend:**
```powershell
cd backend
python -m venv .venv
.\.venv\Scripts\Activate.ps1
pip install -r requirements.txt
```

**Frontend:**
```powershell
cd frontend
npm install
```

### Step 2: Start Servers

**Option A: Automated (Recommended)**
```powershell
# From QFF root directory
.\start.ps1
```

**Option B: Manual**

Terminal 1 (Backend):
```powershell
cd backend
.\.venv\Scripts\Activate.ps1
uvicorn app.main:app --reload --port 8000
```

Terminal 2 (Frontend):
```powershell
cd frontend
npm run dev
```

### Step 3: Access Application

- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:8000
- **API Docs**: http://localhost:8000/docs

### Step 4: Login & Test

1. Open http://localhost:3000
2. Username: `demo` (or any name)
3. Click "Login to Demo"

## 🎯 Quick Test Scenarios

### Test 1: Low Risk Transaction ✅
1. Type: **Bank Transfer**
2. Amount: `100`
3. Currency: **INR**
4. Receiver: `alice@bank.com`
5. Click **AI Analyze**
6. Expected: Score 85-95, GREEN, PROCEED
7. Click **Execute**

### Test 2: Crypto Transfer ₿
1. Type: **Crypto Transfer**
2. Amount: `0.5`
3. Currency: **BTC**
4. Receiver: `bc1qxy2kgdygjrsqtzq2n0yrf2493p83kkfjhx0wlh`
5. Click **AI Analyze**
6. Expected: Score 70-80, YELLOW
7. Click **Execute**

### Test 3: High Risk (BLOCKED) 🚨
1. Type: **Smart Contract**
2. Amount: `50000`
3. Currency: **ETH**
4. Receiver: `0xdeadbeef`
5. Click **AI Analyze**
6. Expected: Score < 50, RED, BLOCK
7. Execution not recommended

## 📊 Features to Demo

### Agentic AI Features
- [x] Real-time risk analysis
- [x] Machine learning anomaly detection
- [x] Explainable AI metrics
- [x] Multi-factor scoring
- [x] Risk recommendations

### Quantum Security
- [x] Post-quantum cryptography (Kyber-1024)
- [x] Quantum signatures (Dilithium-5)
- [x] QKD simulation
- [x] Interception detection
- [x] Quantum fingerprints

### Transaction Types
Try all 10+ types:
- Bank Transfer
- UPI Payment
- Card Payment
- Crypto Transfer
- Smart Contract
- Forex Payment
- Wire Transfer
- ACH Transfer
- SEPA Transfer
- SWIFT Payment

### Multi-Currency
Test with different currencies:
- **Fiat**: INR, USD, EUR, GBP, JPY, CNY, SAR, AED
- **Crypto**: BTC, ETH, USDT, USDC, SOL, XRP

## 🔍 What to Show

### 1. Multi-Account Dashboard
- View 10+ accounts across different types
- Multiple currencies (INR, USD, EUR, BTC, ETH, etc.)
- Real-time balances

### 2. AI Risk Analysis
- Create transaction
- Get instant AI analysis
- See risk score and factors
- View explainability metrics

### 3. Quantum Security Layer
- Establish quantum-safe key
- See interception detection (set probability to 0.5 to demo)
- Execute with quantum encryption
- View quantum fingerprint

### 4. Transaction History
- Click "Transaction History" tab
- See all past transactions
- View risk scores
- Check quantum fingerprints

### 5. API Documentation
- Open http://localhost:8000/docs
- Show Swagger UI
- Demonstrate API endpoints
- Test endpoints directly

## 🛠️ Troubleshooting

### Backend won't start
```powershell
# Check Python version
python --version  # Should be 3.9+

# Reinstall dependencies
pip install -r requirements.txt --force-reinstall
```

### Frontend won't start
```powershell
# Check Node version
node --version  # Should be 18+

# Clear cache and reinstall
Remove-Item -Recurse -Force node_modules
npm install
```

### Port already in use
```powershell
# Backend (8000)
Get-Process -Id (Get-NetTCPConnection -LocalPort 8000).OwningProcess | Stop-Process

# Frontend (3000)
Get-Process -Id (Get-NetTCPConnection -LocalPort 3000).OwningProcess | Stop-Process
```

### Database errors
```powershell
# Delete and recreate database
cd backend
Remove-Item qff.db
# Restart backend - database will be recreated with seed data
```

## 📞 API Endpoints Quick Reference

### Core APIs
```http
GET  /health                    # Health check
GET  /balance?userId=user-1     # Get balances
POST /analyze                   # AI risk analysis
POST /execute                   # Execute transaction
GET  /history                   # Transaction history
```

### Quantum APIs
```http
POST /quantum-establish         # Establish quantum key
GET  /quantum-status           # Quantum layer status
GET  /pqc-info                 # PQC information
```

### Testing with curl
```powershell
# Health check
curl http://localhost:8000/health

# Get balances
curl http://localhost:8000/balance?userId=user-1

# Analyze transaction
curl -X POST http://localhost:8000/analyze `
  -H "Content-Type: application/json" `
  -d '{"type":"BANK_TRANSFER","amount":"100","currency":"INR","receiver":"alice@bank.com","details":{}}'
```

## 🤖 Automated Judge Demo
To run the full evaluation suite and generate a report:
```powershell
# From QFF root directory
.\scripts\judge_demo.sh
```
This will:
1. Seed the database
2. Run safe, suspicious, and malicious scenarios
3. Test QKD interception
4. Generate `demo_report.txt` and `demo_artifacts.zip`

## 🎬 Demo Script (3 minutes)

**Minute 1: Login & Overview**
- Open app, login as "demo"
- Show multi-currency accounts
- Highlight quantum status indicator

**Minute 2: Transaction Flow**
- Create transaction (Bank Transfer, ₹100)
- Click "AI Analyze"
- Show risk score, factors, explainability
- Establish quantum key
- Execute transaction

**Minute 3: Features**
- Try high-risk transaction (blocked)
- View transaction history
- Show quantum fingerprints
- Open API docs at /docs

## ✅ Success Checklist

Before demo:
- [ ] Both servers running
- [ ] Frontend loads at localhost:5173
- [ ] Can login successfully
- [ ] Balances display correctly
- [ ] AI analysis works
- [ ] Transaction execution works
- [ ] History shows transactions
- [ ] API docs accessible

## 🎯 Key Talking Points

1. **Agentic AI**: "Our ML engine analyzes transactions in real-time using Isolation Forest for anomaly detection"

2. **Quantum Security**: "We use NIST-approved post-quantum cryptography - Kyber for key exchange and Dilithium for signatures"

3. **Comprehensive Support**: "10+ transaction types across traditional banking, UPI, cards, and cryptocurrency"

4. **Multi-Currency**: "Supporting 14+ currencies including major fiat and cryptocurrencies"

5. **Production-Ready**: "Built with FastAPI, React, TypeScript - includes monitoring, security, and HSM integration"

## 📚 Additional Resources

- Full README: `README.md`
- Implementation details: `IMPLEMENTATION_SUMMARY.md`
- API Documentation: http://localhost:8000/docs
- Metrics: http://localhost:8000/metrics

## 🏁 Stop Servers

```powershell
# From QFF root directory
.\stop.ps1
```

Or press `Ctrl+C` in each terminal window.
