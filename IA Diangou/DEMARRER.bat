@echo off
echo ========================================
echo   DEMARRAGE DE IA DIANGOU
echo ========================================
echo.

echo [1/2] Demarrage du serveur BACKEND...
start "Backend - IA Diangou" cmd /k "cd /d %~dp0backend && npm run start"
timeout /t 3 /nobreak >nul

echo [2/2] Demarrage du serveur FRONTEND...
start "Frontend - IA Diangou" cmd /k "cd /d %~dp0frontend && npm run dev"
timeout /t 3 /nobreak >nul

echo.
echo ========================================
echo   SERVEURS DEMARRES !
echo ========================================
echo.
echo Backend:  http://localhost:5003
echo Frontend: http://localhost:5173
echo.
echo Ouvre ton navigateur sur: http://localhost:5173
echo.
echo Appuyez sur une touche pour fermer cette fenetre...
pause >nul

