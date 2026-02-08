@echo off
cls
echo ========================================
echo   LANCEMENT IA PROFESSEUR
echo ========================================
echo.

echo [1/2] Arret des processus Python...
taskkill /f /im python.exe >nul 2>&1
timeout /t 1 /nobreak >nul

echo [2/2] Lancement du serveur Flask...
start "IA Professeur - Serveur" cmd /k "cd /d %~dp0 && echo === SERVEUR FLASK IA PROFESSEUR === && echo. && py app.py"

echo.
echo ✅ Serveur lance dans une nouvelle fenetre
echo.
echo [3/3] Ouverture du navigateur dans 5 secondes...
timeout /t 5 /nobreak >nul
start http://localhost:5000

echo.
echo ========================================
echo   ✅ APPLICATION LANCEE !
echo ========================================
echo.
echo 📝 VERIFIEZ :
echo   1. La fenetre CMD avec "Running on http://127.0.0.1:5000"
echo   2. Le navigateur avec l'interface IA Professeur
echo   3. Si la page est blanche, attendez 10 secondes puis F5
echo.
echo 🎓 TESTEZ : Posez une question comme "bonjour" ou "alphabet"
echo.
echo 💡 Pour arreter : Fermez la fenetre CMD du serveur
echo.
pause

