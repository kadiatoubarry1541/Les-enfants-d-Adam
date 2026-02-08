@echo off
cls
title IA PROFESSEUR
color 0A

echo.
echo ========================================
echo   LANCEMENT IA PROFESSEUR
echo ========================================
echo.

echo [1] Arret des processus Python...
taskkill /f /im python.exe >nul 2>&1
timeout /t 1 /nobreak >nul

echo [2] Lancement du serveur...
cd /d %~dp0
start "SERVEUR" cmd /k "cd /d %~dp0 && title SERVEUR FLASK && color 0B && echo ======================================== && echo   SERVEUR FLASK IA PROFESSEUR && echo ======================================== && echo. && py app.py"

echo [3] Attente 8 secondes...
timeout /t 8 /nobreak

echo [4] Ouverture du navigateur...
start http://localhost:5000

echo.
echo ========================================
echo   ✅ LANCE !
echo ========================================
echo.
echo Regardez la fenetre "SERVEUR" 
echo Si vous voyez "Running on http://127.0.0.1:5000" = OK
echo.
echo Si erreur dans le navigateur, attendez 5 sec puis F5
echo.
pause

