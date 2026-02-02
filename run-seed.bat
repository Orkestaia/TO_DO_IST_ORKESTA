@echo off
echo Ejecutando seed de la base de datos...
node --import tsx --no-warnings prisma/seed.ts
echo.
echo Seed completado!
pause
