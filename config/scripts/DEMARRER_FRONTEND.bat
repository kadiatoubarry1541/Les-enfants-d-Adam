@echo off
echo ========================================
echo   DEMARRAGE DU FRONTEND
echo   Les Enfants d'Adam et Eve
echo ========================================
echo.

cd /d "%~dp0..\..\frontend"

echo [1/2] Verification des dependances...
if not exist "node_modules" (
    echo Installation des dependances...
    call npm install
    if errorlevel 1 (
        echo ERREUR: Echec de l'installation des dependances
        pause
        exit /b 1
    )
) else (
    echo Dependances deja installees
)

echo.
echo [2/2] Demarrage du serveur frontend...
echo.
echo Le frontend va demarrer sur http://localhost:5173
echo Appuyez sur Ctrl+C pour arreter le serveur
echo.
echo ========================================
echo.

call npm run dev

pause
