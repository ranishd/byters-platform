@echo off
echo.
echo  ======================================
echo   Byters Lead Finder — Quick Start
echo  ======================================
echo.

REM Check if .env exists
if not exist ".env" (
  echo  [!] .env file not found!
  echo  [!] Please copy .env.example to .env and fill in your API keys first.
  echo.
  echo      copy .env.example .env
  echo.
  pause
  exit /b 1
)

echo  [1/3] Installing frontend dependencies...
call npm install
if %errorlevel% neq 0 ( echo [ERROR] npm install failed. && pause && exit /b 1 )

echo.
echo  [2/3] Installing backend engine dependencies...
cd engine
call npm install
if %errorlevel% neq 0 ( echo [ERROR] engine npm install failed. && pause && exit /b 1 )
cd ..

echo.
echo  [3/3] Starting servers...
echo.
echo  Backend  → http://localhost:3000
echo  Frontend → http://localhost:5173
echo.
echo  Open TWO separate terminal windows and run:
echo.
echo    Terminal 1 (Backend):   npm run start:backend
echo    Terminal 2 (Frontend):  npm run start:frontend
echo.
echo  Or press any key to start the BACKEND in this window first,
echo  then open a second terminal and run: npm run start:frontend
echo.
pause

npm run start:backend
