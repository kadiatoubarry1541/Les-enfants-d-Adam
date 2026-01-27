@echo off
chcp 65001 >nul
title Les Enfants d'Adam et Eve - Démarrage IA Automatique
color 0B

echo.
echo ╔══════════════════════════════════════════════════════════════╗
echo ║     DÉMARRAGE AUTOMATIQUE DE L'IA PROFESSEUR                ║
echo ║     Les Enfants d'Adam et Eve                                ║
echo ╚══════════════════════════════════════════════════════════════╝
echo.
echo Ce script va vérifier que Backend et Frontend sont actifs,
echo puis démarrer automatiquement l'IA Professeur.
echo.

REM ========================================
REM Vérification de Python
REM ========================================
echo [1/4] Vérification de Python...
echo ──────────────────────────────────────

python --version >nul 2>&1
if %errorlevel% neq 0 (
    py --version >nul 2>&1
    if %errorlevel% neq 0 (
        echo ❌ Python n'est pas installé ou n'est pas dans le PATH
        echo L'IA ne pourra pas démarrer
        pause
        exit /b 1
    ) else (
        set PYTHON_CMD=py
        echo ✅ Python détecté (py)
    )
) else (
    set PYTHON_CMD=python
    echo ✅ Python détecté (python)
)

REM ========================================
REM Vérification que Backend est actif
REM ========================================
echo.
echo [2/4] Vérification que le Backend est actif...
echo ──────────────────────────────────────

set BACKEND_READY=0
set MAX_ATTEMPTS=30
set ATTEMPT=0

:CHECK_BACKEND
set /a ATTEMPT+=1
echo Tentative %ATTEMPT%/%MAX_ATTEMPTS% : Vérification du port 5002...

netstat -ano | findstr :5002 >nul 2>&1
if %errorlevel% == 0 (
    echo ✅ Backend détecté sur le port 5002 !
    set BACKEND_READY=1
    goto :BACKEND_OK
) else (
    if %ATTEMPT% geq %MAX_ATTEMPTS% (
        echo ❌ Le Backend n'est pas actif après %MAX_ATTEMPTS% tentatives
        echo.
        echo Veuillez d'abord lancer le Backend avec:
        echo   cd backend
        echo   npm start
        echo.
        pause
        exit /b 1
    ) else (
        timeout /t 2 /nobreak >nul
        goto :CHECK_BACKEND
    )
)

:BACKEND_OK

REM ========================================
REM Vérification que Frontend est actif
REM ========================================
echo.
echo [3/4] Vérification que le Frontend est actif...
echo ──────────────────────────────────────

set FRONTEND_READY=0
set ATTEMPT=0

:CHECK_FRONTEND
set /a ATTEMPT+=1
echo Tentative %ATTEMPT%/%MAX_ATTEMPTS% : Vérification du port 5173...

netstat -ano | findstr :5173 >nul 2>&1
if %errorlevel% == 0 (
    echo ✅ Frontend détecté sur le port 5173 !
    set FRONTEND_READY=1
    goto :FRONTEND_OK
) else (
    if %ATTEMPT% geq %MAX_ATTEMPTS% (
        echo ❌ Le Frontend n'est pas actif après %MAX_ATTEMPTS% tentatives
        echo.
        echo Veuillez d'abord lancer le Frontend avec:
        echo   cd frontend
        echo   npm run dev
        echo.
        pause
        exit /b 1
    ) else (
        timeout /t 2 /nobreak >nul
        goto :CHECK_FRONTEND
    )
)

:FRONTEND_OK

REM ========================================
REM Vérification de l'environnement IA
REM ========================================
echo.
echo [4/4] Préparation de l'environnement IA...
echo ──────────────────────────────────────

cd /d "%~dp0..\..\ia-sc"

if not exist "venv" (
    echo Création de l'environnement virtuel Python...
    %PYTHON_CMD% -m venv venv
    if errorlevel 1 (
        echo ❌ ERREUR: Impossible de créer l'environnement virtuel
        cd /d "%~dp0..\.."
        pause
        exit /b 1
    )
    echo ✅ Environnement virtuel créé
)

if exist "venv\Scripts\activate.bat" (
    call venv\Scripts\activate.bat
    if not exist "venv\Lib\site-packages\flask" (
        echo Installation des dépendances Python...
        pip install -r requirements.txt
        if errorlevel 1 (
            echo ❌ ERREUR: Échec de l'installation des dépendances Python
            cd /d "%~dp0..\.."
            pause
            exit /b 1
        )
        echo ✅ Dépendances Python installées
    ) else (
        echo ✅ Dépendances Python déjà installées
    )
)

REM Vérifier si le port 5000 est déjà utilisé
netstat -ano | findstr :5000 >nul 2>&1
if %errorlevel% == 0 (
    echo ⚠️  Le port 5000 (IA) est déjà utilisé
    echo Libération du port 5000...
    for /f "tokens=5" %%a in ('netstat -ano ^| findstr :5000') do (
        taskkill /PID %%a /F >nul 2>&1
    )
    timeout /t 2 /nobreak >nul
)

REM ========================================
REM Démarrage de l'IA
REM ========================================
echo.
echo ╔══════════════════════════════════════════════════════════════╗
echo ║              🚀 DÉMARRAGE DE L'IA PROFESSEUR                 ║
echo ╚══════════════════════════════════════════════════════════════╝
echo.
echo ✅ Backend actif sur http://localhost:5002
echo ✅ Frontend actif sur http://localhost:5173
echo.
echo 🚀 Démarrage de l'IA Professeur sur http://localhost:5000...
echo.

start "🔷 IA Professeur - Port 5000" cmd /k "title IA Professeur - Port 5000 && cd /d %~dp0..\..\ia-sc && call venv\Scripts\activate.bat && %PYTHON_CMD% app.py"

timeout /t 3 /nobreak >nul

echo.
echo ╔══════════════════════════════════════════════════════════════╗
echo ║                    ✅ IA DÉMARRÉE                            ║
echo ╚══════════════════════════════════════════════════════════════╝
echo.
echo 📍 Tous les services sont maintenant actifs:
echo    • Backend:  http://localhost:5002
echo    • Frontend: http://localhost:5173
echo    • IA:       http://localhost:5000
echo.
echo 💡 La fenêtre de l'IA est maintenant ouverte
echo    Fermez-la pour arrêter l'IA
echo.
echo ═══════════════════════════════════════════════════════════════
echo.
pause

cd /d "%~dp0..\.."
