@echo off
chcp 65001 >nul
echo ========================================
echo   IA PROFESSEUR - LANCEMENT COMPLET
echo ========================================
echo.

echo [1/3] Arrêt des processus existants...
taskkill /F /IM python.exe /T >nul 2>&1
taskkill /F /IM node.exe /T >nul 2>&1
timeout /t 2 >nul

echo [2/3] Lancement du Backend Flask (port 5000)...
cd /d %~dp0
start "Backend Flask" cmd /k "py app.py"
timeout /t 5 >nul

echo [3/3] Lancement du Frontend React (port 3000)...
cd frontend
start "Frontend React" cmd /k "npm start"
timeout /t 10 >nul

echo.
echo ========================================
echo   ✅ LANCEMENT TERMINÉ !
echo ========================================
echo.
echo Backend Flask : http://localhost:5000
echo Frontend React : http://localhost:3000
echo.
echo Le navigateur va s'ouvrir dans 5 secondes...
timeout /t 5 >nul
start http://localhost:3000
echo.
echo ✅ Si la page est blanche, attendez 30 secondes (React compile)
echo.
pause

