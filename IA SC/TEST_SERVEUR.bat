@echo off
cls
echo ========================================
echo   TEST ET LANCEMENT DU SERVEUR
echo ========================================
echo.

echo [1/4] Arret des processus Python...
taskkill /f /im python.exe >nul 2>&1
timeout /t 1 /nobreak >nul
echo ✅ OK

echo.
echo [2/4] Test de Python et Flask...
py -c "import flask; print('Flask OK')" 2>nul
if errorlevel 1 (
    echo ❌ ERREUR: Flask n'est pas installe
    echo Installez avec: pip install flask flask-cors python-dotenv psycopg2-binary openai
    pause
    exit /b 1
)
echo ✅ Python et Flask OK

echo.
echo [3/4] Lancement du serveur Flask...
start "IA Professeur - SERVEUR" cmd /k "cd /d %~dp0 && echo ======================================== && echo   SERVEUR FLASK IA PROFESSEUR && echo ======================================== && echo. && echo Demarrage en cours... && echo. && py app.py"

echo ✅ Serveur lance dans une nouvelle fenetre
echo.

echo [4/4] Attente du demarrage (10 secondes)...
timeout /t 10 /nobreak

echo.
echo Ouverture du navigateur...
start http://localhost:5000

echo.
echo ========================================
echo   ✅ APPLICATION LANCEE !
echo ========================================
echo.
echo 📝 VERIFIEZ :
echo   1. La fenetre CMD avec "Running on http://127.0.0.1:5000"
echo   2. Le navigateur avec l'interface IA Professeur
echo   3. Si vous voyez encore une erreur, attendez 5 secondes puis F5
echo.
echo 🎓 TESTEZ : Posez "bonjour" ou "alphabet"
echo.
echo 💡 Pour arreter : Fermez la fenetre CMD du serveur
echo.
pause

