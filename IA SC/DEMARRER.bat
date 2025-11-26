@echo off
chcp 65001 >nul
title IA Professeur - Démarrage
color 0A

echo.
echo ========================================
echo   IA PROFESSEUR - DEMARRAGE
echo ========================================
echo.

echo [1/2] Lancement du Backend Flask...
cd /d %~dp0
start "Backend Flask" /MIN cmd /k "py app.py"
timeout /t 5 >nul

echo [2/2] Lancement du Frontend React...
cd frontend
start "Frontend React" cmd /k "npm start"
timeout /t 15 >nul

echo.
echo ========================================
echo   ✅ DEMARRAGE TERMINE !
echo ========================================
echo.
echo Le navigateur va s'ouvrir dans 5 secondes...
echo.
echo Si la page est blanche, attendez 30 secondes
echo puis appuyez sur F5 pour actualiser.
echo.
timeout /t 5 >nul
start http://localhost:3000

echo.
echo Appuyez sur une touche pour fermer cette fenetre...
pause >nul

