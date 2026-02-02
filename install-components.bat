@echo off
echo Installing dependencies...
call npm install cmdk
echo Installing ShadCN components...
call npx shadcn@latest add calendar popover command checkbox dialog select --yes
echo Done!
pause
