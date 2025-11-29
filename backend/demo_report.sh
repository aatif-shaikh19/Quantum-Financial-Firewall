#!/bin/bash
echo "Snapshotting metrics..."
curl -s http://localhost:8000/metrics > metrics_snapshot.txt
echo "Metrics saved to metrics_snapshot.txt"
