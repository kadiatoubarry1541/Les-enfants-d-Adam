@echo off
echo Ouverture du poster dans Microsoft Word...
echo.

REM Essayer d'ouvrir avec Word
start winword "%~dp0Poster_IA_Diangou_SIFSC.rtf"

REM Si Word n'est pas trouvé, essayer avec l'association par défaut
if errorlevel 1 (
    echo Word n'a pas pu s'ouvrir automatiquement.
    echo.
    echo METHODE ALTERNATIVE:
    echo 1. Ouvrez Microsoft Word manuellement
    echo 2. Cliquez sur Fichier ^> Ouvrir
    echo 3. Naviguez vers: %~dp0
    echo 4. Selectionnez: Poster_IA_Diangou_SIFSC.rtf
    echo 5. Cliquez sur Ouvrir
    echo.
    pause
    start "" "%~dp0Poster_IA_Diangou_SIFSC.rtf"
)

