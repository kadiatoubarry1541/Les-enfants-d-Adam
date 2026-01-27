@echo off
chcp 65001 >nul
title Les Enfants d'Adam et Eve - Démarrage Complet avec IA
color 0A

echo.
echo ╔══════════════════════════════════════════════════════════════╗
echo ║     DÉMARRAGE COMPLET DU PROJET AVEC IA PROFESSEUR          ║
echo ║     Les Enfants d'Adam et Eve                                ║
echo ╚══════════════════════════════════════════════════════════════╝
echo.
echo Ce script va démarrer automatiquement:
echo   ✓ Backend Node.js    (Port 5002)
echo   ✓ Frontend React     (Port 5173)
echo   ✓ IA Professeur      (Port 5000)
echo.
echo IMPORTANT: 3 fenêtres de terminal s'ouvriront automatiquement
echo.
timeout /t 2 /nobreak >nul

REM ========================================
REM ÉTAPE 1: Vérification de PostgreSQL
REM ========================================
echo.
echo [1/6] Vérification de PostgreSQL...
echo ──────────────────────────────────────

sc query | findstr /i "postgresql" >nul 2>&1
if %errorlevel% neq 0 (
    echo ⚠️  PostgreSQL ne semble pas être démarré
    echo.
    set /p start_postgres="Voulez-vous démarrer PostgreSQL maintenant ? (O/N): "
    if /i "%start_postgres%"=="O" (
        echo Démarrage de PostgreSQL...
        net start postgresql-x64-15 2>nul || net start postgresql-x64-14 2>nul || net start postgresql-x64-13 2>nul
        if %errorlevel% == 0 (
            echo ✅ PostgreSQL démarré
            timeout /t 3 /nobreak >nul
        ) else (
            echo ❌ Impossible de démarrer PostgreSQL automatiquement
            echo Veuillez le démarrer manuellement depuis les Services Windows
            timeout /t 3 /nobreak >nul
        )
    )
) else (
    echo ✅ PostgreSQL est déjà démarré
)

REM ========================================
REM ÉTAPE 2: Vérification des dépendances Backend
REM ========================================
echo.
echo [2/6] Vérification des dépendances Backend...
echo ──────────────────────────────────────

cd /d "%~dp0..\..\backend"
if not exist "node_modules" (
    echo Installation des dépendances Node.js...
    call npm install
    if errorlevel 1 (
        echo ❌ ERREUR: Échec de l'installation des dépendances backend
        cd /d "%~dp0..\.."
        pause
        exit /b 1
    )
    echo ✅ Dépendances backend installées
) else (
    echo ✅ Dépendances backend déjà installées
)

if not exist "config.env" (
    if exist "config.env.example" (
        echo ⚠️  Création de config.env depuis config.env.example...
        copy "config.env.example" "config.env" >nul
        echo ⚠️  ATTENTION: Veuillez configurer config.env avant de continuer
        timeout /t 2 /nobreak >nul
    ) else (
        echo ❌ ERREUR: config.env.example non trouvé
        cd /d "%~dp0..\.."
        pause
        exit /b 1
    )
)

cd /d "%~dp0..\.."

REM ========================================
REM ÉTAPE 3: Vérification des dépendances Frontend
REM ========================================
echo.
echo [3/6] Vérification des dépendances Frontend...
echo ──────────────────────────────────────

cd /d "%~dp0..\..\frontend"
if not exist "node_modules" (
    echo Installation des dépendances React...
    call npm install
    if errorlevel 1 (
        echo ❌ ERREUR: Échec de l'installation des dépendances frontend
        cd /d "%~dp0..\.."
        pause
        exit /b 1
    )
    echo ✅ Dépendances frontend installées
) else (
    echo ✅ Dépendances frontend déjà installées
)
cd /d "%~dp0..\.."

REM ========================================
REM ÉTAPE 4: Vérification de Python et IA
REM ========================================
echo.
echo [4/6] Vérification de Python et IA...
echo ──────────────────────────────────────

python --version >nul 2>&1
if %errorlevel% neq 0 (
    py --version >nul 2>&1
    if %errorlevel% neq 0 (
        echo ❌ Python n'est pas installé ou n'est pas dans le PATH
        echo L'IA ne pourra pas démarrer
        set IA_DISABLED=1
    ) else (
        set PYTHON_CMD=py
        echo ✅ Python détecté (py)
    )
) else (
    set PYTHON_CMD=python
    echo ✅ Python détecté (python)
)

if not defined IA_DISABLED (
    cd /d "%~dp0..\..\ia-sc"
    
    if not exist "venv" (
        echo Création de l'environnement virtuel Python...
        %PYTHON_CMD% -m venv venv
        if errorlevel 1 (
            echo ❌ ERREUR: Impossible de créer l'environnement virtuel
            set IA_DISABLED=1
        ) else (
            echo ✅ Environnement virtuel créé
        )
    )
    
    if not defined IA_DISABLED (
        if exist "venv\Scripts\activate.bat" (
            call venv\Scripts\activate.bat
            if not exist "venv\Lib\site-packages\flask" (
                echo Installation des dépendances Python...
                pip install -r requirements.txt
                if errorlevel 1 (
                    echo ❌ ERREUR: Échec de l'installation des dépendances Python
                    set IA_DISABLED=1
                ) else (
                    echo ✅ Dépendances Python installées
                )
            ) else (
                echo ✅ Dépendances Python déjà installées
            )
        )
    )
    
    cd /d "%~dp0..\.."
)

REM ========================================
REM ÉTAPE 5: Vérification des ports
REM ========================================
echo.
echo [5/6] Vérification des ports...
echo ──────────────────────────────────────

netstat -ano | findstr :5002 >nul 2>&1
if %errorlevel% == 0 (
    echo ⚠️  Le port 5002 (Backend) est déjà utilisé
    echo Libération du port 5002...
    for /f "tokens=5" %%a in ('netstat -ano ^| findstr :5002') do (
        taskkill /PID %%a /F >nul 2>&1
    )
    timeout /t 1 /nobreak >nul
)

netstat -ano | findstr :5173 >nul 2>&1
if %errorlevel% == 0 (
    echo ⚠️  Le port 5173 (Frontend) est déjà utilisé
    echo Libération du port 5173...
    for /f "tokens=5" %%a in ('netstat -ano ^| findstr :5173') do (
        taskkill /PID %%a /F >nul 2>&1
    )
    timeout /t 1 /nobreak >nul
)

if not defined IA_DISABLED (
    netstat -ano | findstr :5000 >nul 2>&1
    if %errorlevel% == 0 (
        echo ⚠️  Le port 5000 (IA) est déjà utilisé
        echo Libération du port 5000...
        for /f "tokens=5" %%a in ('netstat -ano ^| findstr :5000') do (
            taskkill /PID %%a /F >nul 2>&1
        )
        timeout /t 1 /nobreak >nul
    )
)

echo ✅ Ports vérifiés

REM ========================================
REM ÉTAPE 6: Démarrage des services
REM ========================================
echo.
echo [6/6] Démarrage des services...
echo ──────────────────────────────────────
echo.

REM Démarrer le Backend
echo 🚀 Démarrage du Backend (Port 5002)...
start "🔷 Backend - Port 5002" cmd /k "title Backend - Port 5002 && cd /d %~dp0..\..\backend && npm start"
timeout /t 5 /nobreak >nul

REM Démarrer le Frontend
echo 🚀 Démarrage du Frontend (Port 5173)...
start "🔷 Frontend - Port 5173" cmd /k "title Frontend - Port 5173 && cd /d %~dp0..\..\frontend && npm run dev"
timeout /t 5 /nobreak >nul

REM Démarrer l'IA si disponible
if not defined IA_DISABLED (
    echo 🚀 Démarrage de l'IA Professeur (Port 5000)...
    start "🔷 IA Professeur - Port 5000" cmd /k "title IA Professeur - Port 5000 && cd /d %~dp0..\..\ia-sc && call venv\Scripts\activate.bat && %PYTHON_CMD% app.py"
    timeout /t 2 /nobreak >nul
) else (
    echo ⚠️  IA non démarrée (Python non disponible)
)

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
