# QFF POV Runbook

## Overview
This guide explains how to run the QFF Proof of Value (POV) evaluation and tune the AI engine.

## Prerequisites
- Docker & Docker Compose
- Python 3.11+

## Step 1: Start the Environment
```bash
docker-compose up -d
```

## Step 2: Seed Data
The system auto-seeds on startup. You can also use the provided dataset for manual testing:
`backend/app/seed/dataset_seed.json`

## Step 3: Run Evaluation
Use the judge demo script to run a full scenario sweep:
```bash
./scripts/judge_demo.sh
```
Check `demo_report.txt` for results.

## Step 4: Tuning AI Thresholds
1. Open `backend/app/ai_engine.py`
2. Adjust the penalties in `analyze()` method.
   - Example: Increase `High Value` penalty from -15 to -20.
3. Restart backend: `docker-compose restart backend`
4. Re-run evaluation to see impact on scores.

## Step 5: Verify Metrics
Access Prometheus metrics at: `http://localhost:8000/metrics`
Look for `qff_analyze_total` and `qff_qkd_attempt_total`.
