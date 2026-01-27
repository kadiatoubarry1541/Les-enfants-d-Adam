@echo off
chcp 65001 >nul
title Les Enfants d'Adam et Eve - Démarrage Complet avec IA
color 0A

echo.
echo ╔══════════════════════════════════════════════════════════════╗
echo ║     DÉMARRAGE COMPLET - Backend + Frontend + IA             ║
echo ║     Les Enfants d'Adam et Eve                                ║
echo ╚══════════════════════════════════════════════════════════════╝
echo.
echo Ce script va démarrer:
echo   ✓ Backend  (Port 5002)
echo   ✓ Frontend (Port 5173)
echo   ✓ IA       (Port 5000) - Se lance automatiquement après
echo.
echo IMPORTANT: 3 fenêtres de terminal s'ouvriront automatiquement
echo.
pause

REM ========================================
REM Vérification de Python pour l'IA
REM ========================================
python --version >nul 2>&1
if %errorlevel% neq 0 (
    py --version >nul 2>&1
    if %errorlevel% neq 0 (
        set PYTHON_CMD=
        set IA_DISABLED=1
    ) else (
        set PYTHON_CMD=py
    )
) else (
    set PYTHON_CMD=python
)

REM ========================================
REM Préparation de l'environnement IA
REM ========================================
if not defined IA_DISABLED (
    cd /d "%~dp0..\..\ia-sc"
    
    if not exist "venv" (
        echo Création de l'environnement virtuel Python...
        %PYTHON_CMD% -m venv venv >nul 2>&1
    )
    
    if exist "venv\Scripts\activate.bat" (
        call venv\Scripts\activate.bat
        if not exist "venv\Lib\site-packages\flask" (
            echo Installation des dépendances Python...
            pip install -r requirements.txt >nul 2>&1
        )
    )
    
    cd /d "%~dp0..\.."
)

REM ========================================
REM Démarrage du Backend
REM ========================================
echo.
echo ========================================
echo   [1/3] DÉMARRAGE DU BACKEND
echo ========================================
echo.

start "🔷 Backend - Port 5002" cmd /k "title Backend - Port 5002 && cd /d %~dp0..\..\backend && npm start"

timeout /t 5 /nobreak >nul

REM ========================================
REM Démarrage du Frontend
REM ========================================
echo.
echo ========================================
echo   [2/3] DÉMARRAGE DU FRONTEND
echo ========================================
echo.

start "🔷 Frontend - Port 5173" cmd /k "title Frontend - Port 5173 && cd /d %~dp0..\..\frontend && npm run dev"

timeout /t 5 /nobreak >nul

REM ========================================
REM Vérification que Backend et Frontend sont actifs
REM ========================================
echo.
echo ========================================
echo   [3/3] VÉRIFICATION ET DÉMARRAGE DE L'IA
echo ========================================
echo.

set BACKEND_READY=0
set FRONTEND_READY=0
set MAX_WAIT=30
set WAIT_COUNT=0

:CHECK_SERVICES
set /a WAIT_COUNT+=1

REM Vérifier Backend
netstat -ano | findstr :5002 >nul 2>&1
if %errorlevel% == 0 set BACKEND_READY=1

REM Vérifier Frontend
netstat -ano | findstr :5173 >nul 2>&1
if %errorlevel% == 0 set FRONTEND_READY=1

REM Si les deux sont prêts, lancer l'IA
if %BACKEND_READY%==1 if %FRONTEND_READY%==1 goto :PREPARE_IA

REM Si on a attendu trop longtemps, lancer quand même l'IA
if %WAIT_COUNT% geq %MAX_WAIT% (
    echo ⚠️  Attente maximale atteinte, lancement de l'IA...
    goto :PREPARE_IA
)

REM Attendre un peu avant de revérifier
timeout /t 2 /nobreak >nul
goto :CHECK_SERVICES

:PREPARE_IA
if defined IA_DISABLED (
    echo ⚠️  IA non disponible (Python non installé)
    goto :END
)

echo ✅ Backend et Frontend détectés
echo.

REM ========================================
REM Création automatique des tables IA dans la base de données
REM ========================================
echo 📊 Configuration de la base de données IA...
cd /d "%~dp0..\..\ia-sc"

if exist "venv\Scripts\activate.bat" (
    call venv\Scripts\activate.bat
    echo Création des tables IA dans la base de données du backend...
    %PYTHON_CMD% creer_tables_ia.py
    if errorlevel 1 (
        echo ⚠️  Impossible de créer les tables IA automatiquement
        echo Les tables seront créées au premier démarrage de l'IA
    ) else (
        echo ✅ Tables IA configurées dans la base de données
    )
) else (
    echo ⚠️  Environnement virtuel non trouvé, création des tables reportée
)

cd /d "%~dp0..\.."

REM Vérifier si le port 5000 est déjà utilisé
netstat -ano | findstr :5000 >nul 2>&1
if %errorlevel% == 0 (
    echo Libération du port 5000...
    for /f "tokens=5" %%a in ('netstat -ano ^| findstr :5000') do (
        taskkill /PID %%a /F >nul 2>&1
    )
    timeout /t 2 /nobreak >nul
)

echo 🚀 Démarrage automatique de l'IA...
echo.

start "🔷 IA Professeur - Port 5000" cmd /k "title IA Professeur - Port 5000 && cd /d %~dp0..\..\ia-sc && call venv\Scripts\activate.bat && %PYTHON_CMD% app.py"

timeout /t 2 /nobreak >nul

:END
echo.
echo ╔══════════════════════════════════════════════════════════════╗
echo ║                    ✅ SERVEURS DÉMARRÉS                      ║
echo ╚══════════════════════════════════════════════════════════════╝
echo.
echo 📍 URLs disponibles:
echo    • Backend:  http://localhost:5002
echo    • Frontend: http://localhost:5173
if not defined IA_DISABLED (
    echo    • IA:       http://localhost:5000
)
echo.
echo 💡 Les fenêtres de terminal sont maintenant ouvertes
echo    Fermez-les pour arrêter les serveurs
echo.
echo ═══════════════════════════════════════════════════════════════
echo.
pause
