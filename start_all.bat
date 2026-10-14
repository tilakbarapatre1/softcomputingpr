@echo off
title Smart Inventory AI - Unified Launcher
echo ===============================================================
echo     Starting Smart Inventory & Procurement AI Platform
echo ===============================================================
echo.
echo [1/3] Launching FastAPI Backend Server on port 8000...
start "Smart Inventory AI - Backend Server" cmd /c "call "%~dp0start_backend.bat""

echo [2/3] Waiting for backend server initialization...
timeout /t 3 /nobreak >nul

echo [3/3] Launching React Vite Frontend Dev Server on port 5173...
start "Smart Inventory AI - Frontend Dev Server" cmd /c "call "%~dp0start_frontend.bat""

echo.
echo ===============================================================
echo   System launched!
echo   - Backend:  http://localhost:8000 (Docs: http://localhost:8000/docs)
echo   - Frontend: http://localhost:5173
echo.
echo   Keep both terminal windows open while using the application.
echo ===============================================================
echo.
timeout /t 3 >nul
