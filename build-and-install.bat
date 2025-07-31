@echo off
echo === Build and Installation of the Stream Deck Plugin ===

:: Configuration des variables
set PLUGIN_NAME=tv.tech-ben.advanced-teams
set PLUGIN_DIR=%APPDATA%\Elgato\StreamDeck\Plugins
set PLUGIN_FOLDER=%PLUGIN_DIR%\%PLUGIN_NAME%.sdPlugin
set BUILD_DIR=Plugin\bin\Debug\Plugin.sdPlugin

echo Building projet...
msbuild Plugin\Plugin.csproj /p:Configuration=Debug

if errorlevel 1 (
    echo Error during the compilation !
    pause
    exit /b 1
)

echo.
echo === Install the plugin ===

:: Créer le dossier du plugin s'il n'existe pas
if not exist "%PLUGIN_FOLDER%" (
    mkdir "%PLUGIN_FOLDER%"
    echo Created plugin folder: %PLUGIN_FOLDER%
)

:: Utiliser robocopy pour copier tout le contenu du dossier de build vers le dossier du plugin
echo Copying all files and subdirectories using robocopy...
robocopy "%BUILD_DIR%" "%PLUGIN_FOLDER%" /S /E

:: Vérifier le code de retour de robocopy (0-7 sont des succès)
if %ERRORLEVEL% LSS 8 (
    echo Robocopy completed successfully
) else (
    echo Robocopy failed with error code: %ERRORLEVEL%
    pause
    exit /b 1
)

echo.
echo === Installation completed ===
echo Plugin successfully installed in: %PLUGIN_FOLDER%
pause