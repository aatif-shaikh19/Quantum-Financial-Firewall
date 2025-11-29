#!/bin/bash
echo "Running QFF Judge Demo..."
python backend/simulate_run.py
zip demo_artifacts.zip demo_report.txt
echo "Demo complete. Artifacts saved to demo_artifacts.zip"
