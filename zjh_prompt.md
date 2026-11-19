<!--
姓名：zjh | 学号：904 |
时间：2026-11-19 | 大模型：CodeBuddy (Tencent Hunyuan Hy)
-->

# 提示词记录（追加写入，禁止覆盖）

## 2026-11-19 13:35 | 提示词全文

在当前项目根目录创建 AGENTS.md，写入以下规则。端口改为 8904（学号 904 后三位）；所有前缀由 wy_ 改为 zjh_；数据库密码使用 **** 占位，真实密码只写入 backend/.env；记录文件为 zjh_prompt.md、backend/zjh_interface.md、backend/zjh_database.md；姓名 zjh、学号 904。规则内容：
## 项目结构与技术栈
- 前端：frontend/ 目录，原生 HTML、CSS、JavaScript，禁止使用任何第三方库、框架、CDN 链接；frontend/ 下建 css/、js/、fonts/、images/ 子目录。
- 后端：backend/ 目录，Node.js + Express，RESTful+MVC 风格，所有接口以 /api/ 为前缀，端口固定为 8xxx（此处为 8904）。
- 使用 express.static 托管 frontend/ 静态资源目录；后端通过 cors 中间件开放全部跨域访问，仅用于课程作业。
- 后端依赖安装：预先将 npm 源切换为国内镜像 npm config set registry https://registry.npmmirror.com；npm i 包名。
- 数据库：MySQL（用户名 root、密码 ****）；凭据写入 backend/.env（DB_USER、DB_PASSWORD、DB_HOST、DB_NAME），不得出现在代码或 AGENTS.md 中；.env 加入 .gitignore；每张表建立后插入至少 8 条有真实业务意义的测试数据。
## 命名与注释
- CSS 类名、JS 变量名、JS 函数名、数据库表名及字段命名一律以 zjh_ 开头。
- 每个文件头部注释块：姓名：zjh | 学号：904 | 时间：yyyy-mm-dd | 大模型：CodeBuddy (Tencent Hunyuan Hy)。
## 记录文件（一律追加写入，禁止覆盖已有内容）
- zjh_prompt.md：每次向 AI 发出开发指令后追加：时间 | 提示词全文 | 大模型名称。
- backend/zjh_interface.md：每次创建或修改接口后追加：接口路径 | HTTP 方法 | 请求参数（含示例）| 响应格式（含 JSON 示例）| 修改时间。
- backend/zjh_database.md：每次建表、改表或插入数据后按执行顺序追加对应 SQL（含 INSERT），仅凭此文件即可重建数据库。
- 统一 JSON 响应格式 { "code": 0, "msg": "提示信息", "data": {...} }，code=0 成功，非 0 失败。
## 前端约定
- 服务器返回的数据和错误信息输出到浏览器控制台；新建 HTML 页面后在 frontend/index.html 中追加超链接入口，文件名含 detail 的除外。

大模型名称：CodeBuddy (Tencent Hunyuan Hy)

## 2026-11-19 13:35 | 提示词全文

请初始化本项目：
1、git init + .gitignore（排除 node_modules、.env）+ 首次提交
2、按 AGENTS.md 规则创建前后端目录骨架、安装依赖
3、创建前端首页 index.html，包括姓名 zjh、学号 904、项目名称、项目类别（自选、模仿），所有完成的 html 页面的超链接。有 canvas 背景动画。主体是页面链接导航。页面美观。
4、创建 readme.md，在根目录下，包括学号 904、姓名 zjh。

大模型名称：CodeBuddy (Tencent Hunyuan Hy)
