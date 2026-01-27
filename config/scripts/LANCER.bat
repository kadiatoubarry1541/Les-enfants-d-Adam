@echo off
echo ========================================
echo   LANCEMENT IA PROFESSEUR
echo ========================================
echo.

echo [1/3] Arret des processus Python...
taskkill /f /im python.exe >nul 2>&1
echo ✅ Processus arretes
echo.

echo [2/3] Lancement du serveur Flask...
start "IA Professeur - Serveur Flask" powershell -NoExit -Command "cd 'C:\Users\koolo barry\Desktop\IA SC'; Write-Host '=== SERVEUR FLASK IA PROFESSEUR ===' -ForegroundColor Green; Write-Host ''; py app.py"
echo 🚀 Serveur Flask lance
echo.

echo [3/3] Ouverture du navigateur dans 5 secondes...
timeout /t 5 /nobreak >nul
start http://localhost:5000
echo 🌐 Navigateur ouvert
echo.

echo ========================================
echo   APPLICATION LANCEE !
echo ========================================
echo.
echo 📝 INSTRUCTIONS:
echo   1. Regardez la fenetre PowerShell qui s'est ouverte
echo   2. Vous devriez voir "Running on http://127.0.0.1:5000"
echo   3. Le navigateur devrait s'ouvrir automatiquement
echo   4. Si la page est blanche, attendez 10 secondes puis F5
echo.
echo 💡 Pour arreter : Fermez la fenetre PowerShell du serveur
echo.
pause

