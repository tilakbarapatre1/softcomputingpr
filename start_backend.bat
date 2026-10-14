@echo off
title Smart Inventory AI - Backend Server
echo Starting FastAPI Backend Server on port 8000...
cd /d "%~dp0"
python -m uvicorn app.main:app --app-dir backend --host 0.0.0.0 --port 8000 --reload
pause
