@echo off
REM Quick Deploy Script for Portfolio
REM Remplacez "Evil-Ghoster" par votre username GitHub

echo ========================================
echo Portfolio - Quick Deploy Script
echo ========================================
echo.

REM Vérifier si Git est installé
where git >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
    echo ❌ Git n'est pas installé!
    echo Installez Git depuis: https://git-scm.com/download/win
    pause
    exit /b 1
)

echo ✓ Git est installé
echo.

REM Vérifier si le repository est déjà initialisé
if not exist ".git" (
    echo 📁 Initialisant le repository...
    git init
    echo.
)

REM Demander les infos GitHub
set /p USERNAME="GitHub Username (ex: Evil-Ghoster): "
set /p COMMIT_MSG="Message du commit (ex: Update portfolio): "

echo.
echo ⏳ Ajoutant les fichiers...
git add .

echo ⏳ Créant le commit...
git commit -m "%COMMIT_MSG%"

REM Vérifier si origin existe
git remote -v | find "origin" >nul
if %ERRORLEVEL% NEQ 0 (
    echo ⏳ Ajoutant le repository distant...
    git remote add origin https://github.com/%USERNAME%/%USERNAME%.github.io.git
    git branch -M main
)

echo ⏳ Poussant vers GitHub...
git push -u origin main

echo.
echo ✅ Déploiement réussi!
echo.
echo 🌐 Votre site sera accessible à:
echo    - https://onjanirina.com (domaine Namecheap)
echo    - https://%USERNAME%.github.io (GitHub Pages)
echo.
echo ⏱️  Attendez 30 secondes - 2 minutes pour la mise à jour
echo.
pause
