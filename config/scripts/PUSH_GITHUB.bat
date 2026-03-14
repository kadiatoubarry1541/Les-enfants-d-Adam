@echo off
chcp 65001 >nul
echo ============================================
echo   Pousser le projet sur GitHub
echo   Les Enfants d'Adam / Terre ADAM
echo ============================================
echo.

cd /d "%~dp0..\.."

echo [1] Vérification du statut Git...
git status
echo.

echo [2] Voulez-vous ajouter tous les fichiers et pousser ? (O/N)
set /p reponse=>
if /i not "%reponse%"=="O" (
    echo Annulé.
    pause
    exit /b 0
)

echo.
echo [3] Ajout des fichiers (le .gitignore exclut les données sensibles)...
git add .
echo.

echo [4] Fichiers qui seront envoyés :
git status
echo.

echo [5] Création du commit...
set /p msg=Message du commit (ou Entrée pour "Mise à jour projet") : 
if "%msg%"=="" set msg=Mise à jour projet
git commit -m "%msg%"
echo.

echo [6] Push vers GitHub...
git push
echo.

echo ============================================
echo   Terminé !
echo ============================================
pause
