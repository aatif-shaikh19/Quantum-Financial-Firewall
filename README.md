# QFF — Quantum Financial Firewall (Complete System)

**Agentic AI + Post-Quantum Cryptography for Secure Financial Transactions**

## 🌟 Features

### ✨ Agentic AI Engine
- **Machine Learning Risk Analysis**: Uses Isolation Forest for anomaly detection
- **Multi-Factor Risk Scoring**: Analyzes amount, transaction type, receiver reputation
- **Real-time Decision Making**: Recommends PROCEED, FLAG, or BLOCK actions
- **Explainable AI**: Provides detailed explainability metrics for each analysis
- **Continuous Learning**: Updates models based on historical transaction patterns

### 🔐 Quantum-Resistant Cryptography
- **Kyber-1024 KEM**: NIST-approved post-quantum key encapsulation
- **Dilithium-5 Signatures**: Post-quantum digital signatures
- **QKD Simulation**: Quantum Key Distribution with interception detection
- **Hybrid Encryption**: ChaCha20-Poly1305 with quantum-derived keys
- **HSM Integration**: Hardware Security Module support (simulated and real)

### 💳 Comprehensive Transaction Support
#### Traditional Banking
- Bank Transfers (SWIFT, ACH, SEPA, Wire)
- Card Payments (Credit/Debit)
- UPI Payments (India)

#### Cryptocurrency
- Bitcoin (BTC)
- Ethereum (ETH)
- Stablecoins (USDT, USDC)
- Smart Contract Execution

#### Cross-Border
- Forex Payments
- Multi-currency support (INR, USD, EUR, GBP, JPY, CNY, SAR, AED)

### 🎯 Payment Rails Integration
- Intelligent routing based on transaction type
- Fee optimization across rails
- Real-time quote generation
- Multi-rail execution support

## 🏗️ Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                    Frontend (React + Vite)                  │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐        │
│  │  Dashboard  │  │   AI Panel  │  │  Quantum    │        │
│  │             │  │             │  │  Status     │        │
│  └─────────────┘  └─────────────┘  └─────────────┘        │
└─────────────────────────────────────────────────────────────┘
                           ↕ REST API
┌─────────────────────────────────────────────────────────────┐
│                 Backend (FastAPI + Python)                  │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐     │
│  │  Agentic AI  │  │  Quantum     │  │   Payment    │     │
│  │  Engine      │  │  Layer       │  │   Gateway    │     │
│  └──────────────┘  └──────────────┘  └──────────────┘     │
│                                                              │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐     │
│  │   Security   │  │  HSM Client  │  │  Telemetry   │     │
│  │   Manager    │  │              │  │  (Prometheus)│     │
│  └──────────────┘  └──────────────┘  └──────────────┘     │
└─────────────────────────────────────────────────────────────┘
                           ↕
┌─────────────────────────────────────────────────────────────┐
│              Database (SQLite / PostgreSQL)                 │
│  • Users & Accounts    • Ledger (Immutable)                │
│  • Transaction History • Audit Logs                         │
└─────────────────────────────────────────────────────────────┘
```

## 🚀 Quick Start

### Prerequisites
- Python 3.9+
- Node.js 18+
- pip and npm

### Backend Setup

```powershell
# Navigate to backend directory
cd backend

# Create virtual environment
python -m venv .venv
.\.venv\Scripts\Activate.ps1

# Install dependencies
pip install -r requirements.txt

# Run backend server
uvicorn app.main:app --reload --port 8000
```

The backend will start at `http://localhost:8000`

**API Documentation**: `http://localhost:8000/docs`

### Frontend Setup

```powershell
# Navigate to frontend directory
cd frontend

# Install dependencies
npm install

# Run development server
npm run dev
```

The frontend will start at `http://localhost:5173`

## 📋 Environment Variables

### Backend (.env)
```env
# Database
QFF_DB_URL=sqlite:///./qff.db  # Or postgresql://user:pass@host/db

# Security
QFF_HSM_MODE=simulation  # simulation | aws_cloudhsm | azure_keyvault

# Demo Configuration
QFF_DEMO_SEED=12345
QFF_INTERCEPT_PROB=0.0  # QKD interception probability (0.0 to 1.0)

# CORS
QFF_CORS_ORIGINS=http://localhost:5173,http://localhost:3000

# Alerts
QFF_ALERT_WEBHOOK=https://your-webhook-url
```

### Frontend (.env)
```env
VITE_API_BASE=http://localhost:8000
```

## 🧪 Testing

### Manual Testing Flow

1. **Login**: Use username "demo"
2. **View Balances**: See multi-currency accounts (INR, USD, EUR, BTC, ETH, etc.)
3. **Create Transaction**:
   - Select transaction type (Bank Transfer, UPI, Crypto, etc.)
   - Enter amount and receiver
   - Click "AI Analyze"
4. **Review AI Analysis**:
   - Safety score (0-100)
   - Risk level (LOW, MEDIUM, HIGH, CRITICAL)
   - Risk factors and explainability
5. **Quantum Key Establishment**:
   - System automatically establishes quantum-safe session
   - Detects interception attempts (if enabled)
6. **Execute Transaction**:
   - Transaction encrypted with quantum-resistant algorithms
   - Recorded in immutable ledger
7. **View History**: Check transaction history with quantum fingerprints

### Test Scenarios

#### Low Risk Transaction
```json
{
  "type": "BANK_TRANSFER",
  "amount": "100.00",
  "currency": "INR",
  "receiver": "alice@bank.com"
}
```
Expected: Score 85-95, Recommendation: PROCEED

#### High Risk Transaction
```json
{
  "type": "CRYPTO_TRANSFER",
  "amount": "50000.00",
  "currency": "BTC",
  "receiver": "0xdead..."
}
```
Expected: Score < 50, Recommendation: BLOCK

## 📡 API Endpoints

### Core Endpoints

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/health` | GET | Health check |
| `/balance?userId={id}` | GET | Get user account balances |
| `/analyze` | POST | AI risk analysis |
| `/quote` | POST | Get transaction quote |
| `/route` | POST | Determine optimal payment rail |
| `/execute` | POST | Execute transaction |
| `/history?limit={n}` | GET | Transaction history |

### Quantum Endpoints

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/quantum-establish` | POST | Establish quantum-safe session |
| `/quantum-status` | GET | Get quantum layer status |
| `/pqc-info` | GET | Post-quantum crypto information |
| `/establish-key` | POST | Legacy key establishment |

### Monitoring

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/metrics` | GET | Prometheus metrics |

## 🔧 Technology Stack

### Backend
- **FastAPI**: Modern async Python web framework
- **SQLAlchemy**: ORM for database operations
- **scikit-learn**: Machine learning for anomaly detection
- **NumPy**: Numerical computations
- **cryptography**: Cryptographic primitives
- **liboqs-python**: Post-quantum cryptography (optional)
- **Prometheus Client**: Metrics and monitoring

### Frontend
- **React 18**: UI library
- **TypeScript**: Type-safe JavaScript
- **Vite**: Fast build tool
- **Tailwind CSS**: Utility-first CSS
- **Lucide React**: Icons

## 🏢 Production Deployment

### Database Migration
For production, use PostgreSQL:
```powershell
$env:QFF_DB_URL="postgresql://user:password@localhost:5432/qff"
```

### HSM Integration
For real quantum-resistant crypto:
```python
# Install liboqs
pip install liboqs-python

# Set environment
$env:QFF_HSM_MODE="real_pqc"
```

### Docker Deployment
```powershell
# Build and run with Docker Compose
docker-compose up -d
```

### Kubernetes
```powershell
# Deploy to K8s
kubectl apply -f k8s/
```

## 📊 Monitoring & Metrics

Access Prometheus metrics at `/metrics`:
- `qff_analyze_total`: Total AI analysis calls
- `qff_qkd_attempt_total`: Total quantum key establishment attempts

## 🔒 Security Features

1. **Defense in Depth**
   - Input sanitization
   - CORS protection
   - Rate limiting
   - Session management

2. **Cryptographic Security**
   - AES-256-GCM encryption
   - SHA-256 hashing
   - HMAC signatures
   - Post-quantum algorithms

3. **Audit Logging**
   - All transactions logged immutably
   - HSM operation audit trail
   - Security event notifications

## 🎓 AI/ML Details

### Anomaly Detection
- **Algorithm**: Isolation Forest
- **Features**: Transaction amount, velocity, historical patterns
- **Training**: Continuously updated with historical data
- **Contamination Rate**: 5% (configurable)

### Risk Factors
- High-value transactions (> $10,000)
- Irreversible crypto transfers
- Unverified receivers
- Velocity spikes
- Cross-border payments
- Anomalous amounts

## 🧬 Quantum Cryptography

### Algorithms
- **KEM**: Kyber-1024 (NIST Level 5 security)
- **Signatures**: Dilithium-5 (NIST Level 5 security)
- **Symmetric**: ChaCha20-Poly1305

### QKD Simulation
Simulates BB84 protocol:
- Photon transmission
- Interception detection (quantum state collapse)
- Key sifting and privacy amplification

## 📚 Additional Resources

- **NIST PQC Standards**: https://csrc.nist.gov/projects/post-quantum-cryptography
- **liboqs**: https://github.com/open-quantum-safe/liboqs-python
- **FastAPI Docs**: https://fastapi.tiangolo.com
- **React Docs**: https://react.dev

## 🤝 Contributing

This is a hackathon prototype. For production use:
1. Implement proper authentication/authorization
2. Use real HSM devices
3. Set up proper database backups
4. Configure monitoring and alerting
5. Perform security audit
6. Implement rate limiting
7. Add comprehensive test suite

## 📄 License

MIT License - See LICENSE file for details

## 🏆 Hackathon Notes

**QFF demonstrates:**
- ✅ Agentic AI for real-time risk analysis
- ✅ Post-quantum cryptography (Kyber + Dilithium)
- ✅ 10+ transaction types support
- ✅ Multi-currency support (fiat + crypto)
- ✅ Payment rail routing
- ✅ Quantum key distribution simulation
- ✅ Explainable AI with metrics
- ✅ Production-ready architecture
- ✅ Comprehensive monitoring
- ✅ HSM integration ready

**Built with:** FastAPI, React, TypeScript, Python, Machine Learning, Post-Quantum Cryptography