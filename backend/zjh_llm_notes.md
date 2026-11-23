<!--
姓名：zjh | 学号：904 |
时间：2026-11-23 | 大模型：CodeBuddy (Tencent Hunyuan Hy)
-->

# LLM 应用跟做 · 课堂任务说明

本文件只记录方案与提示词，**不含任何真实 API Key**。真实 Key 仅存于 `backend/.env`（已被 `.gitignore` 忽略）。

## 任务一 · 把 Key 藏好：3 处可能泄露 Key 的地方

1. **前端 JS / HTML**：把 Key 写进 `frontend/js/*.js` 或页面里，用户按 F12 就能看到；正确做法是由前端请求自己的 `/api/chat`，后端带 Key 转发。
2. **提交到 Git 的文件**：把 Key 写进 `AGENTS.md`、`zjh_prompt.md`、`zjh_interface.md` 或截图放进作业文档；正确做法是 `.env` 加入 `.gitignore`，文档中一律写成 `sk-****`。
3. **命令行历史与聊天截图**：curl 命令、终端输出、班级群截图里带出完整 Key；正确做法是命令中使用环境变量、截图打码。

现状检查：`.gitignore` 已包含 `.env`；前端源码和三个记录文件中均无真实 Key；下拉框只切换平台名，不传 Key。

## 任务二 · 客服人设改造（中华美食街在线客服）

### system 提示词（写在 `backend/controllers/zjh_chat_controller.js` 的 `ZJH_SERVICE_SYSTEM`）

```
你是「中华美食街」的在线客服小美，服务态度亲切、简洁。
你只回答以下三类问题，其他问题一律不要回答：
1. 营业时间：每天 10:00-22:00，周末照常营业。
2. 招牌菜：糖醋鲤鱼（38元）、麻婆豆腐（22元）、小笼包（18元）、宫保鸡丁（32元）。
3. 配送范围：门店周边 3 公里内可配送，满 30 元起送，超出范围欢迎到店品尝。
规则：
- 用户问上述三类问题时，直接依据上面的信息回答，不要编造未提供的信息。
- 用户问其他任何问题（学习、天气、编程、其他店铺等）时，礼貌拒绝并引导留言：
  抱歉，这个问题不在我的服务范围内，您可以留下联系方式，我们会尽快回复您。
- 每次回答不超过 120 字，使用中文。
```

### 5 个测试问题（3 该答、2 该拒）

| 编号 | 问题 | 预期 | 判定要点 |
|---|---|---|---|
| 1 | 你们几点营业？ | 该答 | 回答 10:00-22:00、周末照常 |
| 2 | 有什么招牌菜？ | 该答 | 从四道菜中列举，价格与提示词一致 |
| 3 | 配送范围有多大？ | 该答 | 回答 3 公里内、满 30 元起送 |
| 4 | 今天天气怎么样？ | 该拒 | 礼貌说明不在服务范围，引导留言 |
| 5 | 帮我写一段 Python 爬虫代码 | 该拒 | 不提供代码，引导留言 |

其中第 4 条已做成页面快捷问题，点一下即可现场验证。

### 为什么这样写能"管住"模型

- **先给人设和边界**：第一句确定身份与语气，第二句明确"只回答三类"，把可用话题收窄。
- **给事实不给自由发挥空间**：营业时间、菜品价格、配送规则直接写进提示词，并要求"不要编造"，模型就不容易胡编。
- **对拒答行为也给出原话**：把"礼貌拒绝 + 引导留言"的完整句子写进去，模型会照着说，而不是自作主张跑题。
- **限制长度与语言**：120 字以内、中文，避免长篇发散。
- **system 由后端固定**：前端只传 `mode: "service"`，用户无法通过页面输入篡改人设（后端控制器过滤掉前端传来的 system 消息）。

## 任务三 · 多平台热切换

切换只需后端 `.env` 里的三个值，页面代码不动：

```
// 硅基流动
baseURL = "https://api.siliconflow.cn/v1"
model   = "deepseek-ai/DeepSeek-V4-Flash"
apiKey  = SILICONFLOW_API_KEY

// 七牛云
baseURL = "https://api.qnaigc.com/v1"
model   = "qiniu/conatus-free"
apiKey  = QINIU_API_KEY
```

页面左上角下拉框把 `provider` 发给 `/api/chat`，后端按白名单读取对应配置；切换平台时保留历史消息，可现场演示继续追问。

### 答辩三问

1. **为什么 Key 不能放前端？** 前端代码下载到浏览器，F12 就能看到，任何人都能盗用额度甚至产生欠费；放在后端 `.env` 里，对外只暴露自己的 `/api/chat` 接口。
2. **多轮对话为什么要传完整 messages？** 大模型接口本身无状态，不会记住上一轮。每次请求把之前的 user / assistant 消息一起发过去，模型才能理解"我刚才问了什么"。项目中用 `zjh_history` 数组维护，并限制最多 20 条防止超出上下文。
3. **换平台改哪几个值？为什么只改这几个？** 改 `baseURL`、`model`、`apiKey` 三个值。因为主流平台兼容 OpenAI 的 `/chat/completions` 接口，请求体结构（model + messages）和响应结构（choices[0].message.content）一致，所以业务代码不用动。

## 实测记录（2026-11-23）

- 硅基流动 `deepseek-ai/DeepSeek-V4-Flash`：curl 返回 HTTP 200 与中文回答，Key 与额度正常。
- 七牛 `qiniu/conatus-free`：返回 HTTP 429 `free_campaign_global_limit`，属于免费模型全局限流，非 Key 错误；后端已把 429 翻译成友好提示，页面可一键切换到硅基流动继续对话。
- 换平台后如果报 404：先检查 baseURL 末尾是否带 `/v1`，以及 model 是否拼写正确。

## 补充：四类模型的实际调用要点（2026-11-23 实测）

| 功能 | 平台 | 模型 | 调用方式 |
|---|---|---|---|
| AI 聊天 / 在线客服 | 硅基流动、七牛 | `deepseek-ai/DeepSeek-V4-Flash`、`qiniu/conatus-free` | `POST /v1/chat/completions`，`messages` 数组 |
| 图像识别 | 硅基流动 | `Qwen/Qwen3-VL-8B-Instruct` | `POST /v1/chat/completions`，content 里放 `image_url` 的 data URL |
| 语音识别 | 七牛 | `qwen/qwen-audio-3.0-asr-flash` | `POST /v1/audio/transcriptions`，multipart 表单 `file` + `model` |
| 知识库问答（RAG） | 硅基流动 | `deepseek-ai/DeepSeek-V4-Flash` | 检索片段拼进 system，再走 `chat/completions` |

**语音识别踩坑记录**：一开始按"视觉模型传图的思路"把音频转成 base64 塞进 `messages` 的 `input_audio` 字段发给 `/v1/chat/completions`，平台返回 502；改用 OpenAI 标准的转写接口 `/v1/audio/transcriptions`（form-data 上传文件）后，同一把 Key、同一个模型立刻返回正确文字。说明音频类模型走的是转写接口，不是对话接口——这也是答辩时"为什么不能只换 model 就完事"的例子。

**实测结果**：上传 8 秒中文语音 `zjh_asr_test.mp3`，返回"七牛的文化是做一个简单的人，做一款简单的产品，做一家简单的公司。"，`usage.seconds = 8`，耗时约 5.8 秒。
