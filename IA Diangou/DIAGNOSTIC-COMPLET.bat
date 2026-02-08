@echo off
echo ========================================
echo   DIAGNOSTIC COMPLET - IA DIANGOU
echo ========================================
echo.

echo [1] Verification des ports...
netstat -ano | findstr ":5173" >nul
if %errorlevel% == 0 (
    echo    ✓ Port 5173 (Frontend) est OCCUPE
) else (
    echo    ✗ Port 5173 (Frontend) est LIBRE - Le serveur n'est pas demarre
)

netstat -ano | findstr ":5003" >nul
if %errorlevel% == 0 (
    echo    ✓ Port 5003 (Backend) est OCCUPE
) else (
    echo    ✗ Port 5003 (Backend) est LIBRE - Le serveur n'est pas demarre
)

echo.
echo [2] Verification des dossiers...
if exist "frontend" (
    echo    ✓ Dossier frontend existe
) else (
    echo    ✗ Dossier frontend MANQUANT
)

if exist "backend" (
    echo    ✓ Dossier backend existe
) else (
    echo    ✗ Dossier backend MANQUANT
)

echo.
echo [3] Verification des fichiers essentiels...
if exist "frontend\package.json" (
    echo    ✓ frontend/package.json existe
) else (
    echo    ✗ frontend/package.json MANQUANT
)

if exist "frontend\src\main.tsx" (
    echo    ✓ frontend/src/main.tsx existe
) else (
    echo    ✗ frontend/src/main.tsx MANQUANT
)

if exist "frontend\index.html" (
    echo    ✓ frontend/index.html existe
) else (
    echo    ✗ frontend/index.html MANQUANT
)

echo.
echo [4] Test de connexion au backend...
curl -s http://localhost:5003/api/health >nul 2>&1
if %errorlevel% == 0 (
    echo    ✓ Backend repond sur http://localhost:5003
) else (
    echo    ✗ Backend ne repond PAS sur http://localhost:5003
)

echo.
echo ========================================
echo   RESUME
echo ========================================
echo.
echo Si les ports sont LIBRES, demarre les serveurs:
echo   1. Terminal 1: cd backend ^&^& npm run start
echo   2. Terminal 2: cd frontend ^&^& npm run dev
echo.
echo Puis ouvre: http://localhost:5173
echo.
pause

