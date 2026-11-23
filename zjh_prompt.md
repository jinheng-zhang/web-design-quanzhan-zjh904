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

## 2026-11-19 13:45 | 提示词全文

创建运行后台的 bat 文件，放在项目根目录：
1、自动切换到 backend 目录再启动（用 %~dp0，双击时不受当前路径影响）；
2、使用 chcp 65001 避免中文日志乱码；
3、启动命令与 package.json 中的脚本保持一致（npm run dev）；
4、结尾加 pause，出错时窗口不关闭。

大模型名称：CodeBuddy (Tencent Hunyuan Hy)

## 2026-11-19 13:48 | 提示词全文

在 frontend/ 下创建 database.html：
1、页面有用户名、密码两个输入框，默认用户名 root，密码由用户自行输入（与 backend/.env 一致），一个"测试连接"按钮；
2、点击后调用后端接口 /api/db-test，把用户名密码发给后端；
3、后端用 mysql2 尝试连接 MySQL，成功返回 { code:0, msg:"数据库连接成功", data:{ 数据库版本 } }，失败返回 code 非 0 和错误信息；
4、前端把结果显示在页面上：成功用绿色，失败用红色，同时在控制台输出；
5、数据库凭据从 backend/.env 读取，不要写死在代码里；
6、完成后在 frontend/index.html 加上本页面的超链接入口。

大模型名称：CodeBuddy (Tencent Hunyuan Hy)

## 2026-11-19 13:50 | 提示词全文

完成科技新闻列表页面：
1、在 MySQL 中建表 zjh_news，字段包含：id、title、summary、content、source、publish_time、cover_img；
2、插入至少 8 条真实的科技新闻测试数据；
3、后端提供 GET /api/news 接口，返回全部新闻（按发布时间倒序），统一 JSON 格式 { code, msg, data }；
4、新建 frontend/news.html，页面顶部显示当前调用的接口地址，下方以列表展示新闻标题、摘要、来源、时间；
5、数据用 fetch 获取，控制台输出返回数据；
6、把建表与插入数据的 SQL 追加写入 backend/zjh_database.md，接口信息追加写入 backend/zjh_interface.md，本次提示词追加写入 zjh_prompt.md；
7、在 frontend/index.html 增加入口链接。

大模型名称：CodeBuddy (Tencent Hunyuan Hy)

## 2026-11-19 13:52 | 提示词全文

完成图文列表页面：
1、在 MySQL 中新建表 zjh_gallery，字段：id、title、description、img_url、category、create_time，插入至少 8 条测试数据；
2、后端提供 GET /api/gallery 接口，返回全部图文数据；
3、新建 frontend/gallery.html，页面顶部显示接口地址，下方用网格布局展示"上图下文"卡片：图片、标题、描述；
4、图片加载失败时显示占位色块，不要出现破图图标；
5、页面适配手机宽度；
6、记录写入 backend/zjh_database.md、backend/zjh_interface.md 和 zjh_prompt.md，并在首页加入口。

大模型名称：CodeBuddy (Tencent Hunyuan Hy)

## 2026-11-19 14:20 | 提示词全文

怎么在浏览器查看本项目

大模型名称：CodeBuddy (Tencent Hunyuan Hy)

## 2026-11-23 13:50 | 提示词全文

使用硅基流动API key创建基本AI应用:AI聊天
Api-key：sk-ruiit****（已脱敏，真实 Key 仅存 backend/.env）
使用七牛的 api key 完成在线客服页面：
Model ID：qiniu/conatus-free
Api-key：sk-8689****（已脱敏，真实 Key 仅存 backend/.env）
OpenAI BaseURL：https://api.qnaigc.com/v1
这是我课程的操作步骤，帮我按照我的流程和我已给的数据，完成本页的所有内容
课程操作步骤页面：https://spontaneous-valkyrie-4e4229.netlify.app/llm-app-lesson

大模型名称：CodeBuddy (Tencent Hunyuan Hy)

## 2026-11-23 13:58 | 提示词全文

完成知识库文件上传功能，构建2个知识库文件，完成基于知识库的问答，支持doc和docx，ppt，完成知识库管理（RAG）：基于本地文件（如 PDF/TXT）上传、解析，构建专属自动客服或问答系统，包括知识库文件上传模块。在控制台输出发送给大模型的数据和接受自大模型的数据。完成图像识别功能，上传图片，返回该图片的描述，使用已有的api-key和模型。实现一个语音识别的功能，使用七牛的Qwen-Audio-3.0-ASR-Flash模型，输入语音，输出文字。

大模型名称：CodeBuddy (Tencent Hunyuan Hy)

## 2026-11-23 14:20 | 提示词全文

七牛 ASR 再试一次，把语音识别补上

大模型名称：CodeBuddy (Tencent Hunyuan Hy)

## 2026-11-23 14:20 | 提示词全文

这步骤完成了嘛？网页中验收清单与课堂任务完成了嘛？（附两张截图：课件「把 Key 写进后端 .env」步骤、课程群作业要求）

大模型名称：CodeBuddy (Tencent Hunyuan Hy)

## 2026-11-23 14:44 | 提示词全文

在课程实践里面加一个LLM实践操作痕迹展示，里面包含：1、页面支持在"硅基流动 / 七牛"之间切换实现AI客服（后端读取配置即可，前端加一个下拉框），并现场演示切换后照常对话。2、完成知识库实现（自己上传文件、验证知识库功能）3、图像识别（上传图片，测试图片识别功能）4、语音识别（测试语音识别功能）

大模型名称：CodeBuddy (Tencent Hunyuan Hy)

## 2026-11-23 15:22 | 提示词全文

将我这个本全栈项目的网页再次优化，不需要那么多模块，列出一些精简的，可以保留我个性化和文字说明的内容。将这个页面中page 08的LLM实践操作痕迹展示删除，并新开一个模块是即需要在页面导航这种大栏目当中新建一个大栏目叫做课堂实践，然后这个命名为 LLM 实际操作痕迹，里面包含关于此内容。然后我已经把所需要的照片截图放入到本文件夹 llm文件夹中，查看照片，并且加入文字里面包含：1、页面支持在"硅基流动 / 七牛"之间切换实现AI客服（后端读取配置即可，前端加一个下拉框）， 并现场演示切换后照常对话。2、完成知识库实现（自己上传文件、验证知识库功能）3、图像识别（上传图片，测试图片识别功能）4、语音识别（测试语音识别功能）。

大模型名称：CodeBuddy (Tencent Hunyuan Hy)
