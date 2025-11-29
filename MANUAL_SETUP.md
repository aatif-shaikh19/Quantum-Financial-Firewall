# QFF - Manual Setup and Start Guide

## Step-by-Step Instructions

### Step 1: Setup Backend

Open PowerShell and run:

```powershell
# Navigate to backend directory
cd C:\Users\Aatif\Downloads\QFF\backend

# Create virtual environment (only needed once)
python -m venv .venv

# Activate virtual environment
.\.venv\Scripts\Activate.ps1

# Install dependencies (only needed once)
pip install -r requirements.txt

# Start the backend server
python -m uvicorn app.main:app --reload --port 8000
```

**Leave this terminal open!** Backend will run on http://localhost:8000

### Step 2: Setup Frontend (New Terminal)

Open a **NEW** PowerShell window and run:

```powershell
# Navigate to frontend directory
cd C:\Users\Aatif\Downloads\QFF\frontend

# Install dependencies (only needed once)
npm install

# Start the frontend server
npm run dev
```

**Leave this terminal open!** Frontend will run on http://localhost:5173

### Step 3: Access the Application

Open your browser and go to:
- **Frontend**: http://localhost:5173
- **Backend API Docs**: http://localhost:8000/docs

---

## Alternative: Use Simple Scripts

### Backend (in backend folder):
```powershell
cd C:\Users\Aatif\Downloads\QFF\backend
.\start-backend.ps1
```

### Frontend (in frontend folder):
```powershell
cd C:\Users\Aatif\Downloads\QFF\frontend
.\start-frontend.ps1
```

---

## Troubleshooting

### Problem: "pip: command not found"
**Solution:** Make sure Python is in your PATH
```powershell
python -m pip install -r requirements.txt
```

### Problem: "npm: command not found"
**Solution:** Install Node.js from https://nodejs.org/

### Problem: "Module not found" errors in backend
**Solution:** Make sure you're in the virtual environment
```powershell
cd backend
.\.venv\Scripts\Activate.ps1
pip install -r requirements.txt
```

### Problem: Port already in use
**Solution:** Kill the process using the port
```powershell
# For port 8000 (backend)
Get-Process -Id (Get-NetTCPConnection -LocalPort 8000).OwningProcess | Stop-Process -Force

# For port 5173 (frontend)
Get-Process -Id (Get-NetTCPConnection -LocalPort 5173).OwningProcess | Stop-Process -Force
```

### Problem: Virtual environment activation fails
**Solution:** You might need to allow script execution
```powershell
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser
```

---

## Quick Test After Starting

1. Check backend is running:
   ```powershell
   curl http://localhost:8000/health
   ```
   Should return: `{"status":"ok","phase":"6-ready"}`

2. Open frontend in browser:
   ```
   http://localhost:5173
   ```
   You should see the QFF login screen

3. Login with username: `demo`

---

## Stop the Servers

Press `Ctrl+C` in each terminal window where the servers are running.

---

## Common First-Time Setup Issues

### Issue 1: SQLAlchemy Warnings
If you see warnings about SQLAlchemy, ignore them - the system will work fine.

### Issue 2: liboqs not installed
If you see "liboqs not available", that's OK - the system will use simulated PQC which works perfectly for demo.

### Issue 3: No accounts showing
If you login and see no accounts:
1. Stop the backend (Ctrl+C)
2. Delete the database file: `backend/qff.db`
3. Restart the backend
4. The system will recreate the database with seed data

---

## Verification Checklist

After starting both servers, verify:

- [ ] Backend terminal shows: "Application startup complete"
- [ ] Backend accessible at http://localhost:8000/health
- [ ] Frontend terminal shows: "Local: http://localhost:5173"
- [ ] Frontend opens in browser without errors
- [ ] Can login with username "demo"
- [ ] Can see account balances
- [ ] Can create and analyze transactions

---

## Next Steps After Successful Start

1. **Login**: Use username "demo"
2. **View Balances**: Check your multi-currency accounts
3. **Create Transaction**: 
   - Type: Bank Transfer
   - Amount: 100
   - Currency: INR
   - Receiver: alice@bank.com
4. **Analyze**: Click "AI Analyze" button
5. **Execute**: Click "Execute" to complete transaction
6. **View History**: Switch to "Transaction History" tab

Enjoy using QFF!
