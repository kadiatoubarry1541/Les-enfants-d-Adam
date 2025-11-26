@echo off
chcp 65001 >nul
echo ========================================
echo   TEST SIMPLE - IA PROFESSEUR
echo ========================================
echo.

echo [1] Test du Backend Flask...
cd /d %~dp0
start "Backend Flask" cmd /k "py app.py"
timeout /t 5 >nul

echo.
echo [2] Test de la connexion backend...
curl http://localhost:5000 2>nul
if %errorlevel% equ 0 (
    echo ✅ Backend Flask fonctionne !
) else (
    echo ❌ Backend Flask ne répond pas
)

echo.
echo [3] Test du Frontend React...
cd frontend
if exist node_modules (
    echo ✅ node_modules existe
) else (
    echo ❌ Installation de node_modules...
    call npm install --legacy-peer-deps
)

echo.
echo [4] Lancement de React...
start "Frontend React" cmd /k "npm start"

echo.
echo ========================================
echo   ✅ TESTS TERMINÉS
echo ========================================
echo.
echo Attendez 30 secondes puis ouvrez:
echo http://localhost:3000
echo.
timeout /t 30 >nul
start http://localhost:3000
pause

