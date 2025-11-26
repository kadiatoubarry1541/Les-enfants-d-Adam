@echo off
chcp 65001 >nul
echo ========================================
echo   DIAGNOSTIC COMPLET
echo ========================================
echo.

echo [1] Vérification Python...
py --version
if %errorlevel% neq 0 (
    echo ❌ Python n'est pas installé !
    pause
    exit
)
echo ✅ Python OK
echo.

echo [2] Vérification Node.js...
node --version
if %errorlevel% neq 0 (
    echo ❌ Node.js n'est pas installé !
    pause
    exit
)
echo ✅ Node.js OK
echo.

echo [3] Vérification Flask...
cd /d %~dp0
py -c "import flask; print('Flask OK')" 2>&1
if %errorlevel% neq 0 (
    echo ❌ Flask n'est pas installé !
    echo Installation de Flask...
    pip install flask flask-cors python-dotenv
)
echo.

echo [4] Vérification React...
cd frontend
if exist node_modules (
    echo ✅ node_modules existe
) else (
    echo ❌ node_modules manquant - Installation...
    call npm install --legacy-peer-deps
)
echo.

echo [5] Vérification des fichiers...
if exist src\App.tsx (
    echo ✅ App.tsx existe
) else (
    echo ❌ App.tsx manquant !
)

if exist src\index.tsx (
    echo ✅ index.tsx existe
) else (
    echo ❌ index.tsx manquant !
)

if exist public\index.html (
    echo ✅ index.html existe
) else (
    echo ❌ index.html manquant !
)
echo.

echo [6] Test du backend...
cd ..
start "Backend Test" cmd /k "py app.py"
timeout /t 5 >nul
curl http://localhost:5000 2>nul
if %errorlevel% equ 0 (
    echo ✅ Backend répond !
) else (
    echo ❌ Backend ne répond pas
)
echo.

echo ========================================
echo   DIAGNOSTIC TERMINÉ
echo ========================================
echo.
pause

