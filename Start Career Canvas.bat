@echo off
setlocal
cd /d "%~dp0"

if not exist "out\index.html" (
    echo Career Canvas offline files are missing. Rebuild with pnpm install and pnpm build.
    pause
    exit /b 1
)

where python >nul 2>nul
if errorlevel 1 (
    echo Python 3 is needed to run Career Canvas but was not found on PATH.
    pause
    exit /b 1
)

start "Career Canvas local server" python -m http.server 8765 --bind 127.0.0.1 --directory "%~dp0out"
timeout /t 2 /nobreak >nul
start "" "http://127.0.0.1:8765"
