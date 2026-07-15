@echo off
echo ============================================
echo  Birds Species Detection - Backend Setup
echo ============================================
echo.

cd /d "%~dp0backend"

:: Check if venv exists, create if not
IF NOT EXIST ".venv\Scripts\python.exe" (
    echo [1/3] Creating virtual environment...
    python -m venv .venv
    echo Done!
) ELSE (
    echo [1/3] Virtual environment already exists. Skipping.
)

echo.
echo [2/3] Installing dependencies...
.venv\Scripts\python.exe -m pip install --upgrade pip --quiet
.venv\Scripts\python.exe -m pip install -r requirements.txt
echo Done!

echo.
echo [3/3] Starting Flask backend server...
echo.
echo Backend will run at: http://localhost:5000
echo Press Ctrl+C to stop.
echo.
.venv\Scripts\python.exe app.py
