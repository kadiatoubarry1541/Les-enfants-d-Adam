@echo off
chcp 65001 >nul
echo ========================================
echo   CREATION DE LA BASE DE DONNEES
echo   IAscience
echo ========================================
echo.

echo [1/3] Verification de PostgreSQL...
psql --version >nul 2>&1
if errorlevel 1 (
    echo [ERREUR] PostgreSQL n'est pas installe ou pas dans le PATH!
    echo.
    echo Veuillez installer PostgreSQL depuis:
    echo https://www.postgresql.org/download/
    echo.
    echo Ou utilisez pgAdmin pour executer le script database.sql
    pause
    exit /b 1
)
echo [OK] PostgreSQL est installe!
echo.

echo [2/3] Creation de la base de donnees IAscience...
echo.
echo Entrez le mot de passe de PostgreSQL (utilisateur: postgres)
echo.
psql -U postgres -f database.sql
if errorlevel 1 (
    echo.
    echo [ERREUR] La creation de la base de donnees a echoue
    echo.
    echo SOLUTIONS:
    echo 1. Verifiez que PostgreSQL est lance
    echo 2. Verifiez votre mot de passe PostgreSQL
    echo 3. Ou utilisez pgAdmin pour executer database.sql manuellement
    pause
    exit /b 1
)
echo.
echo [OK] Base de donnees creee avec succes!
echo.

echo [3/3] Configuration...
echo.
echo La base de donnees IAscience est maintenant creee!
echo.
echo Configuration par defaut:
echo - Host: localhost
echo - Port: 5432
echo - Database: IAscience
echo - User: postgres
echo - Password: (votre mot de passe PostgreSQL)
echo.
echo Ces informations sont dans le fichier .env
echo.

pause

