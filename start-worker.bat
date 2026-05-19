@echo off
set NODE_OPTIONS=--use-system-ca
cd /d C:\Users\facui\Desktop\remotion-engine

:loop
npm run worker >> worker.log 2>&1
echo [%date% %time%] Worker stopped, restarting in 5s... >> worker.log
timeout /t 5 /nobreak > nul
goto loop
