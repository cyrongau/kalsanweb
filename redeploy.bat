@echo off
echo ===================================================
echo   KALSAN WEB - FRESH DEPLOYMENT SCRIPT
echo ===================================================
echo.

echo 1. Stopping running containers...
docker-compose down

echo.
echo 2. Removing old images to force rebuild...
docker rmi kalsanweb-frontend kalsanweb-backend

echo.
echo 3. Pruning unused volumes (Optional - assumes data is in named volumes or bound mounts that persist, verify before running in prod if unsure)
:: echo y | docker volume prune

echo.
echo 4. Rebuilding and Starting containers...
docker-compose up --build -d

echo.
echo ===================================================
echo   DEPLOYMENT COMPLETE
echo   Please wait for containers to initialize.
echo ===================================================
pause
