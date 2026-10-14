@echo off
title Smart Inventory AI - Backend Server
echo ===============================================================
echo   Starting Smart Inventory AI - FastAPI Backend Server
echo ===============================================================

cd /d "%~dp0"

:: Ensure Windows uses the genuine Python 3.14 installation before the WindowsApps stub
set "PATH=%USERPROFILE%\AppData\Local\Python\bin;%USERPROFILE%\AppData\Local\Python\pythoncore-3.14-64;%PATH%"

set "PYTHON_EXE="
if exist "%USERPROFILE%\AppData\Local\Python\bin\python.exe" (
    set "PYTHON_EXE=%USERPROFILE%\AppData\Local\Python\bin\python.exe"
) else if exist "%USERPROFILE%\AppData\Local\Python\pythoncore-3.14-64\python.exe" (
    set "PYTHON_EXE=%USERPROFILE%\AppData\Local\Python\pythoncore-3.14-64\python.exe"
) else (
    set "PYTHON_EXE=python"
)

echo Selected Python: %PYTHON_EXE%
echo API Documentation will be available at: http://localhost:8000/docs
echo Backend REST endpoint:                 http://localhost:8000/api/v1
echo.
"%PYTHON_EXE%" -m uvicorn app.main:app --app-dir backend --host 127.0.0.1 --port 8000 --reload
pause
