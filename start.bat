@echo off
echo Starting ContentMagic...
echo.
echo Starting Backend Server...
start "Backend Server" cmd /k "cd /d %~dp0 && node server/index.js"
timeout /t 3 /nobreak >nul
echo.
echo Starting Frontend Client...
start "Frontend Client" cmd /k "cd /d %~dp0 && npm run client"
echo.
echo ContentMagic is starting...
echo Backend: http://localhost:3001
echo Frontend: http://localhost:5173
echo.
