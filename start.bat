@echo off
REM 姓名：zjh | 学号：904 | 时间：2026-11-19 | 大模型：CodeBuddy (Tencent Hunyuan Hy)
chcp 65001
title 全栈项目本地服务 - zjh 端口 8904
cd /d %~dp0backend
call npm run dev
pause
