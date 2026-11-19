<!--
姓名：zjh | 学号：904 |
时间：2026-11-19 | 大模型：CodeBuddy (Tencent Hunyuan Hy)
-->

# 全栈项目初始化案例

- 姓名：zjh
- 学号：904
- 端口：8904（学号后三位）
- 项目名称：zjh 全栈新闻图文站
- 项目类别：课程作业 / 全栈 Web 应用（模仿科技资讯与图文社区）

## 技术栈
- 前端：原生 HTML / CSS / JavaScript（无任何第三方库与 CDN）
- 后端：Node.js + Express（RESTful + MVC 风格）
- 数据库：MySQL

## 启动方式
1. 按 `backend/.env.example` 配置 `backend/.env`（真实数据库密码只写在 `.env`，不要提交）
2. 双击项目根目录 `start.bat`，或在 `backend/` 目录执行 `npm run dev`
3. 浏览器访问 `http://localhost:8904/`

## 页面
- `/index.html`：首页导航（canvas 背景动画）
- `/database.html`：数据库连接测试
- `/news.html`：科技新闻列表
- `/gallery.html`：图文列表

## 记录文件
- `zjh_prompt.md`：提示词记录
- `backend/zjh_interface.md`：接口记录
- `backend/zjh_database.md`：数据库 SQL 记录
