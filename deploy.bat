@echo off
REM ========================================
REM Portfolio ONJA - Quick Deploy Script
REM Domaine: onjanirina.me
REM ========================================

chcp 65001 >nul
setlocal enabledelayedexpansion

echo.
echo ════════════════════════════════════════════════
echo   🚀  PORTFOLIO ONJA - DÉPLOIEMENT
echo ════════════════════════════════════════════════
echo.
echo    🌐 Domaine: onjanirina.me
echo    📦 Dépôt: GitHub Pages
echo.

REM Vérifier si Git est installé
where git >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
    echo ❌ Git n'est pas installé!
    echo 📥 Téléchargez depuis: https://git-scm.com/download/win
    pause
    exit /b 1
)
echo ✅ Git est installé

REM Vérifier la présence du fichier CNAME
if not exist "CNAME" (
    echo 📝 Création du fichier CNAME pour onjanirina.me...
    echo onjanirina.me > CNAME
    echo ✅ CNAME créé
)

echo.
echo ════════════════════════════════════════════════
echo    ÉTAPE 1 : Configuration du dépôt
echo ════════════════════════════════════════════════
echo.

REM Demander les informations
set /p USERNAME="GitHub Username: "
set /p COMMIT_MSG="Message du commit (ex: Mise à jour portfolio): "

if "%COMMIT_MSG%"=="" set COMMIT_MSG=Mise à jour portfolio ONJA

echo.
echo ════════════════════════════════════════════════
echo    ÉTAPE 2 : Sauvegarde des fichiers
echo ════════════════════════════════════════════════
echo.

echo 📦 Ajout des fichiers...
git add .

echo 📝 Création du commit...
git commit -m "%COMMIT_MSG%"

echo.
echo ════════════════════════════════════════════════
echo    ÉTAPE 3 : Push vers GitHub
echo ════════════════════════════════════════════════
echo.

REM Vérifier si le remote origin existe
git remote -v | find "origin" >nul
if %ERRORLEVEL% NEQ 0 (
    echo ⚙️  Configuration du remote...
    git remote add origin https://github.com/%USERNAME%/%USERNAME%.github.io.git
    git branch -M main
)

echo 📤 Push vers GitHub...
git push -u origin main

if %ERRORLEVEL% NEQ 0 (
    echo.
    echo ⚠️  Erreur lors du push. Vérifiez :
    echo    1. Vous êtes connecté à GitHub
    echo    2. Le dépôt existe : https://github.com/%USERNAME%/%USERNAME%.github.io
    echo    3. Les permissions sont correctes
    pause
    exit /b 1
)

echo.
echo ════════════════════════════════════════════════
echo    ✅ DÉPLOIEMENT RÉUSSI !
echo ════════════════════════════════════════════════
echo.
echo    🌐 Site accessible à :
echo       https://onjanirina.me
echo.
echo    🔗 URL alternative :
echo       https://%USERNAME%.github.io
echo.
echo    📱 Optimisé mobile & tablette
echo    🔒 HTTPS activé automatiquement
echo.
echo ════════════════════════════════════════════════
echo    ⏱️  Propagation DNS : 5-30 minutes max
echo    📦 Mise à jour GitHub : 1-2 minutes
echo ════════════════════════════════════════════════
echo.
pause