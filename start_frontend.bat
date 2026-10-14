@echo off
title Smart Inventory AI - Frontend Dev Server
echo Starting React Vite Frontend on port 5173...
set "PATH=%USERPROFILE%\.local\node\node-v20.18.0-win-x64;%PATH%"
cd /d "%~dp0frontend"
npm run dev -- --host
pause
