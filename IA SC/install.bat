@echo off
echo ========================================
echo   INSTALLATION AUTOMATIQUE
echo   IA Grand-Mere - Guide pour Debutants
echo ========================================
echo.

echo [1/3] Verification de Python...
python --version
if errorlevel 1 (
    echo ERREUR: Python n'est pas installe!
    echo.
    echo Veuillez installer Python depuis:
    echo https://www.python.org/downloads/
    echo.
    echo IMPORTANT: Cochez "Add Python to PATH" lors de l'installation
    pause
    exit /b 1
)
echo OK: Python est installe!
echo.

echo [2/3] Installation des bibliotheques Python...
echo Cela peut prendre 1-2 minutes...
python -m pip install --upgrade pip
python -m pip install flask flask-cors python-dotenv openai requests
if errorlevel 1 (
    echo ERREUR: L'installation a echoue
    pause
    exit /b 1
)
echo OK: Bibliotheques installees!
echo.

echo [3/3] Verification du fichier .env...
if not exist .env (
    echo ATTENTION: Le fichier .env n'existe pas
    echo.
    echo Voulez-vous le creer maintenant? (O/N)
    set /p create_env=
    if /i "%create_env%"=="O" (
        echo OPENAI_API_KEY=sk-votre_cle_ici > .env
        echo Fichier .env cree!
        echo.
        echo IMPORTANT: Editez le fichier .env et remplacez
        echo "sk-votre_cle_ici" par votre vraie cle API
        echo.
        echo Obtenez une cle sur: https://platform.openai.com/
    )
) else (
    echo OK: Le fichier .env existe
)
echo.

echo ========================================
echo   INSTALLATION TERMINEE!
echo ========================================
echo.
echo Pour lancer l'application, tapez:
echo   python app.py
echo.
echo Puis ouvrez votre navigateur sur:
echo   http://localhost:5000
echo.
pause


