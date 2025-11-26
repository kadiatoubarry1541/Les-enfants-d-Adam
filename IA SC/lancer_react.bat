@echo off
echo ========================================
echo   LANCEMENT IA PROFESSEUR - REACT
echo ========================================
echo.

echo [1/2] Arret des processus existants...
taskkill /F /IM python.exe /T >nul 2>&1
taskkill /F /IM node.exe /T >nul 2>&1
timeout /t 2 >nul

echo [2/2] Lancement du backend Flask...
start "Backend Flask" cmd /k "cd /d %~dp0 && py app.py"

echo.
echo Attente du demarrage du backend (5 secondes)...
timeout /t 5 >nul

echo.
echo [3/3] Lancement du frontend React...
cd frontend
start "Frontend React" cmd /k "npm start"

echo.
echo ========================================
echo   ✅ LANCEMENT TERMINE !
echo ========================================
echo.
echo Le navigateur va s'ouvrir automatiquement...
echo.
echo Backend Flask : http://localhost:5000
echo Frontend React : http://localhost:3000
echo.
timeout /t 8 >nul
start http://localhost:3000
echo.
echo Appuyez sur une touche pour fermer cette fenetre...
pause >nul

