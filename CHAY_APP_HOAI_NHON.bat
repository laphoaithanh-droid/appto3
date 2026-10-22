@echo off
chcp 65001 >nul
title LearnMap - Truong Tieu hoc Hoai Nhon
color 0B

echo =========================================================================
echo       HE SINH THAI HOC TAP THICH UNG LEARNMAP - GDPT 2018
echo              DON VI: TRUONG TIEU HOC HOAI NHON
echo =========================================================================
echo.
echo [1/3] Dang khoi dong may chu LearnMap...
echo.

cd /d "%~dp0"

:: Kiem tra neu port 3000 dang chay thi khong can start lai
netstat -ano | findstr :3000 >nul
if %ERRORLEVEL% EQU 0 (
    echo [OK] May chu dang chay san tren cong 3000.
) else (
    echo [*] Dang khoi chay tien trinh nen tren cong 3000...
    start /min "LearnMap Server" cmd /c "npm.cmd start"
    timeout /t 3 >nul
)

echo [2/3] May chu da san sang!
echo.
echo  - Dia chi may chu hien tai:    http://localhost:3000
echo  - Dia chi mang LAN truong hoc:  http://192.168.1.14:3000
echo.
echo [3/3] Dang mo trinh duyet...
start http://localhost:3000

echo =========================================================================
echo App da duoc khoi chay thanh cong! Ban co the dong cua so nay bat cu luc nao.
echo =========================================================================
timeout /t 5 >nul
