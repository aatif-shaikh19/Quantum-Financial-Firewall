# Docker Setup Guide

## Prerequisites
- Docker Desktop installed and running.

## Steps to Run

1. **Build and Start Containers**
   Open a terminal in the root `QFF` directory and run:
   ```powershell
   docker-compose up --build -d
   ```

2. **Verify Containers are Running**
   ```powershell
   docker-compose ps
   ```
   You should see `qff-backend` and `qff-frontend` (and `prometheus` if configured) in the `Up` state.

3. **Access the Application**
   - **Frontend**: http://localhost:3000
   - **Backend API**: http://localhost:8000
   - **Metrics**: http://localhost:8000/metrics

4. **View Logs**
   ```powershell
   docker-compose logs -f
   ```

5. **Stop Containers**
   ```powershell
   docker-compose down
   ```

## Troubleshooting
- If ports are in use, stop existing processes or modify `docker-compose.yml`.
- If database errors occur, the volume will persist data. To reset, run `docker-compose down -v`.
