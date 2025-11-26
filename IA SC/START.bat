@echo off
cls
title IA PROFESSEUR - LANCEMENT
color 0A

echo.
echo ========================================
echo   IA PROFESSEUR - LANCEMENT
echo ========================================
echo.

echo [1/3] Arret des processus Python...
taskkill /f /im python.exe >nul 2>&1
timeout /t 1 /nobreak >nul
echo OK

echo.
echo [2/3] Lancement du serveur Flask...
start "SERVEUR FLASK" cmd /k "cd /d %~dp0 && title SERVEUR FLASK IA PROFESSEUR && color 0B && echo ======================================== && echo   SERVEUR FLASK IA PROFESSEUR && echo ======================================== && echo. && py app.py"

echo OK - Fenetre serveur ouverte
echo.

echo [3/3] Attente 10 secondes puis ouverture du navigateur...
timeout /t 10 /nobreak

echo.
echo Ouverture du navigateur...
start http://localhost:5000

echo.
echo ========================================
echo   APPLICATION LANCEE !
echo ========================================
echo.
echo VERIFIEZ :
echo   1. La fenetre "SERVEUR FLASK" avec "Running on http://127.0.0.1:5000"
echo   2. Le navigateur avec l'interface IA Professeur
echo   3. Si erreur, attendez 5 secondes puis F5
echo.
echo TESTEZ : Posez "bonjour" ou "alphabet"
echo.
pause

