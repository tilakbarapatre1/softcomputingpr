@echo off
title Smart Inventory AI - Frontend Dev Server
echo ===============================================================
echo   Starting Smart Inventory AI - React Frontend
echo ===============================================================

cd /d "%~dp0frontend"

if exist "%USERPROFILE%\.local\node\node-v20.18.0-win-x64" (
    set "PATH=%USERPROFILE%\.local\node\node-v20.18.0-win-x64;%PATH%"
)
if exist "C:\Program Files\nodejs" (
    set "PATH=C:\Program Files\nodejs;%PATH%"
)

echo Starting Vite Dev Server on port 5173...
echo Dashboard will automatically open in your default browser.
echo.
npm run dev -- --host --open
pause
