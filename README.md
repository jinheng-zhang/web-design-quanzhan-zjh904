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
- 代码仓库：<https://github.com/jinheng-zhang/web-design-quanzhan-zjh904>

## 技术栈
- 前端：原生 HTML / CSS / JavaScript（无任何第三方库与 CDN）
- 后端：Node.js + Express（RESTful + MVC 风格）
- 数据库：MySQL

## 启动方式
1. 按 `backend/.env.example` 配置 `backend/.env`（真实数据库密码只写在 `.env`，不要提交）
2. 双击项目根目录 `start.bat`，或在 `backend/` 目录执行 `npm run dev`
3. 浏览器访问 `http://localhost:8904/`

## 页面（导航分 3 个栏目）
- 基础功能
  - `/index.html`：首页导航（canvas 背景动画）
  - `/database.html`：数据库连接测试
  - `/news.html`：科技新闻列表
  - `/gallery.html`：图文列表
- AI 能力
  - `/chat.html`：AI 聊天与在线客服（硅基流动 / 七牛热切换、多轮对话、客服人设）
  - `/kb.html`：知识库 RAG（上传 doc/docx/ppt/pptx/pdf/txt，解析入库后按资料作答）
  - `/vision.html`：图像识别（Qwen3-VL 返回中文描述）
  - `/asr.html`：语音识别（七牛 Qwen-Audio-3.0-ASR-Flash）
- 课堂实践
  - `/practice.html`：LLM 实际操作痕迹（四项能力的真机截图与结果说明，截图原图见 `llm/`）

## 大模型配置
两个平台的 Key、BaseURL、Model ID 只写在 `backend/.env`，前端只传平台名，由后端 `/api/chat`、`/api/kb/*`、`/api/vision`、`/api/asr` 带 Key 转发。改完 `.env` 必须重启后端。

## 记录文件
- `zjh_prompt.md`：提示词记录
- `backend/zjh_interface.md`：接口记录
- `backend/zjh_database.md`：数据库 SQL 记录
