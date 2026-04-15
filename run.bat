@echo off
title Ejecutando Proyecto TechStore

echo ====================================================
echo       TechStore - Iniciando E-commerce
echo ====================================================
echo.

:: Abrir el Backend en una nueva ventana de comandos
echo [1/2] Iniciando el Backend en .NET...
start "Backend API" cmd /k "cd Backend && dotnet run --urls http://0.0.0.0:5222"

:: Dar un par de segundos de espera para no saturar los logs iniciales
timeout /t 3 /nobreak >nul

:: Abrir el Frontend en otra ventana
echo [2/2] Iniciando el Frontend (Python HTTP Server)...
start "Frontend App" cmd /k "python -m http.server 8000"

echo.
echo ====================================================
echo   Todo Listo. Usa las ventanas nuevas para ver 
echo   los registros (logs) de cada servicio.
echo.
echo   - Backend corriendo en:   http://0.0.0.0:5222 (o http://localhost:5222 localmente)
echo   - Frontend corriendo en:  http://0.0.0.0:8000 (o http://localhost:8000 localmente)
echo.
echo   [!] Para abrir desde otra PC, usa la IP de esta maquina en vez de localhost.
echo       Ejemplo: http://192.168.1.X:8000
echo ====================================================
echo.
pause
