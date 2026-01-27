@echo off
echo ========================================
echo   DEMARRAGE DU BACKEND
echo   Les Enfants d'Adam et Eve
echo ========================================
echo.

cd /d "%~dp0..\..\backend"

echo [1/3] Verification des dependances...
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
echo [2/3] Verification de la configuration...
if not exist "config.env" (
    echo ATTENTION: config.env n'existe pas
    echo Copiez config.env.example vers config.env et configurez-le
    echo.
    if exist "config.env.example" (
        copy "config.env.example" "config.env"
        echo Fichier config.env cree depuis config.env.example
        echo VEUILLEZ LE CONFIGURER AVANT DE CONTINUER
        pause
        exit /b 1
    ) else (
        echo ERREUR: config.env.example n'existe pas
        pause
        exit /b 1
    )
) else (
    echo Configuration trouvee
)

echo.
echo [3/3] Verification du port 5002...
echo.

REM Verifier si le port 5002 est deja utilise
netstat -ano | findstr :5002 >nul 2>&1
if %errorlevel% == 0 (
    echo ATTENTION: Le port 5002 est deja utilise !
    echo.
    echo Voulez-vous liberer le port ? (O/N)
    set /p choice="Votre choix: "
    if /i "%choice%"=="O" (
        echo.
        echo Liberation du port 5002...
        for /f "tokens=5" %%a in ('netstat -ano ^| findstr :5002') do (
            echo Suppression du processus %%a...
            taskkill /PID %%a /F >nul 2>&1
        )
        echo Port 5002 libere !
        timeout /t 2 /nobreak >nul
    ) else (
        echo.
        echo Vous pouvez utiliser le script LIBERER_PORT_5002.bat pour liberer le port manuellement
        echo.
    )
)

echo.
echo [4/4] Demarrage du serveur backend...
echo.
echo Le serveur va demarrer sur le port 5002
echo Appuyez sur Ctrl+C pour arreter le serveur
echo.
echo ========================================
echo.

call npm start

pause
