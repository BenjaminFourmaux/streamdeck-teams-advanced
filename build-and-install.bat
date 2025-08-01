@echo off
echo === Build and Installation of the Stream Deck Plugin ===

:: Configuration variables
set CONFIG_TARGET=Debug
set PLUGIN_NAME=tv.tech-ben.teams-advanced
set PLUGIN_DIR=%APPDATA%\Elgato\StreamDeck\Plugins
set PLUGIN_FOLDER=%PLUGIN_DIR%\%PLUGIN_NAME%.sdPlugin
set BUILD_DIR=Plugin\bin\%CONFIG_TARGET%\%PLUGIN_NAME%.sdPlugin

:: Build the plugin
echo Building project...
echo Configuration target: %CONFIG_TARGET%
msbuild Plugin /p:Configuration=%CONFIG_TARGET% /verbosity:quiet /nologo

if %ERRORLEVEL% NEQ 0 (
    echo Error during compilation!
    pause
    exit /b 1
)
echo Build completed successfully.

:: Check Elgato CLI installed
echo Checking if Elgato Stream Deck CLI is installed...
where streamdeck >nul 2>&1

if %ERRORLEVEL% NEQ 0 (
    echo ERROR: Elgato Stream Deck CLI not found!
    echo Please install the Stream Deck CLI from: https://docs.elgato.com/streamdeck/cli/intro/#installing-from-npm
    echo The CLI is required for plugin validation.
    pause
    exit /b 1
) else (
    echo Elgato Stream Deck CLI installed.
)

:: Validate the plugin
echo Validating the plugin...
streamdeck validate "%BUILD_DIR%"

echo === Installing the plugin ===

:: Create plugin folder if it doesn't exist
if not exist "%PLUGIN_FOLDER%" (
    mkdir "%PLUGIN_FOLDER%" >nul 2>&1
    echo Created plugin folder: %PLUGIN_FOLDER%
)

:: Use robocopy to copy all build content to plugin folder (suppress detailed output)
echo Copying plugin files...
robocopy "%BUILD_DIR%" "%PLUGIN_FOLDER%" /S /E /NP /NDL /NFL /NC /NS /NJH /NJS >nul

:: Check robocopy return code (0-7 are success codes)
if %ERRORLEVEL% LSS 8 (
    echo Plugin files copied successfully.
) else (
    echo Robocopy failed with error code: %ERRORLEVEL%
    pause
    exit /b 1
)

echo.
echo === Installation completed ===
echo Plugin successfully installed in: %PLUGIN_FOLDER%
pause