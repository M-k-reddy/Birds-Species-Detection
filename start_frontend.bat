@echo off
echo ============================================
echo  Birds Species Detection - Frontend
echo ============================================
echo.
cd /d "%~dp0"

IF NOT EXIST "node_modules" (
    echo [1/2] Installing node modules...
    npm install
    echo Done!
) ELSE (
    echo [1/2] node_modules already present. Skipping install.
)

echo.
echo [2/2] Starting React frontend...
echo.
echo Frontend will run at: http://localhost:3000
echo Press Ctrl+C to stop.
echo.
npm start
