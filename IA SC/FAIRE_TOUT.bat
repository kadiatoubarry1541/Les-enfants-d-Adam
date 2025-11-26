@echo off
chcp 65001 >nul
cls
echo ========================================
echo   AIDE COMPLETE
echo   IA Grand-Mere
echo ========================================
echo.

echo [INFO] Ce script va vous aider a installer et lancer l'application.
echo.

REM Verifier Python
echo [1/4] Verification de Python...
py -3 --version >nul 2>&1
if %errorlevel%==0 (
    echo [OK] Python est installe!
    py -3 --version
    goto :python_ok
)

py -3.11 --version >nul 2>&1
if %errorlevel%==0 (
    echo [OK] Python est installe!
    py -3.11 --version
    goto :python_ok
)

py -3.10 --version >nul 2>&1
if %errorlevel%==0 (
    echo [OK] Python est installe!
    py -3.10 --version
    goto :python_ok
)

REM Python n'est pas trouve
echo [ERREUR] Python n'est pas installe!
echo.
echo ========================================
echo   PYTHON N'EST PAS INSTALLE
echo ========================================
echo.
echo Pour installer Python:
echo.
echo 1. Allez sur: https://www.python.org/downloads/
echo 2. Cliquez sur "Download Python" (bouton jaune)
echo 3. Telechargez le fichier .exe
echo 4. Double-cliquez sur le fichier telecharge
echo 5. IMPORTANT: Cochez "Add Python to PATH" ^^!
echo 6. Cliquez sur "Install Now"
echo 7. Attendez la fin de l'installation
echo 8. Redemarrez votre ordinateur
echo 9. Relancez ce script
echo.
echo ========================================
echo.
echo Voulez-vous ouvrir python.org maintenant? (O/N)
set /p ouvrir=""
if /i "%ouvrir%"=="O" (
    start https://www.python.org/downloads/
)
echo.
pause
exit /b 1

:python_ok
echo.
echo [2/4] Installation des bibliotheques...
echo Cela peut prendre 1-2 minutes...
py -3 -m pip install --quiet --upgrade pip
py -3 -m pip install --quiet flask flask-cors python-dotenv openai requests psycopg2-binary
if errorlevel 1 (
    echo [ERREUR] L'installation a echoue
    pause
    exit /b 1
)
echo [OK] Bibliotheques installees!
echo.

echo [3/4] Verification du fichier .env...
if not exist .env (
    echo [ATTENTION] Le fichier .env n'existe pas
    echo Creation du fichier .env...
    (
        echo OPENAI_API_KEY=sk-votre_cle_ici
        echo DATABASE_URL=postgresql://postgres:postgres@localhost:5432/IAscience
    ) > .env
    echo [OK] Fichier .env cree!
    echo.
    echo IMPORTANT: Editez le fichier .env et ajoutez votre cle API OpenAI
    echo Obtenez une cle sur: https://platform.openai.com/
    echo.
)
echo.

echo [4/4] Demarrage du serveur...
echo.
echo ========================================
echo   LE NAVIGATEUR VA S'OUVRIR DANS 3 SECONDES!
echo ========================================
echo.
echo Pour arreter l'application, appuyez sur Ctrl+C
echo.
echo ========================================
echo.

REM Ouvrir le navigateur apres 3 secondes
start "" cmd /c "timeout /t 3 /nobreak >nul && start http://localhost:5000"

REM Lancer l'application Flask
py -3 app.py

pause

