@echo off
cd /d "%~dp0"
title 零跑C16 3D展示
echo.
echo ========================================
echo    零跑C16 3D交互展示
echo ========================================
echo.
echo 正在启动本地服务器...
echo.
echo 请访问: http://localhost:8000
echo.
echo 按 Ctrl+C 停止服务器
echo.
python server.py