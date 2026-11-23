<!--
姓名：zjh | 学号：904 |
时间：2026-11-19 | 大模型：CodeBuddy (Tencent Hunyuan Hy)
-->

# 接口记录（追加写入，禁止覆盖）

统一响应格式：`{ "code": 0, "msg": "提示信息", "data": {...} }`

## /api/health
- HTTP 方法：GET
- 请求参数：无，示例：`GET http://localhost:8904/api/health`
- 响应格式：`{ "code": 0, "msg": "ok", "data": { "status": "running", "port": 8904, "time": "2026-11-19T05:45:00.000Z" } }`
- 修改时间：2026-11-19 13:45

## /api/db-test
- HTTP 方法：POST
- 请求参数：JSON `{ "username": "root", "password": "sql0123" }`（示例密码仅作演示，真实凭据由 backend/.env 提供）
- 响应格式（成功）：`{ "code": 0, "msg": "数据库连接成功", "data": { "version": "8.0.30", "host": "127.0.0.1" } }`
- 响应格式（失败）：`{ "code": 401, "msg": "Access denied for user 'root' (using password: YES)", "data": null }`
- 修改时间：2026-11-19 13:45

## /api/news
- HTTP 方法：GET
- 请求参数：无，示例：`GET http://localhost:8904/api/news`
- 响应格式：`{ "code": 0, "msg": "ok", "data": { "list": [ { "id": 1, "title": "800G 光模块产线正式投产", "summary": "...", "content": "...", "source": "科技前沿网", "publish_time": "2026-11-18T09:30:00.000Z", "cover_img": "https://..." } ], "total": 8 } }`
- 修改时间：2026-11-19 13:45

## /api/gallery
- HTTP 方法：GET
- 请求参数：无，示例：`GET http://localhost:8904/api/gallery`
- 响应格式：`{ "code": 0, "msg": "ok", "data": { "list": [ { "id": 1, "title": "晨雾中的山峦", "description": "...", "img_url": "https://...", "category": "自然风光", "create_time": "2026-11-18T08:20:00.000Z" } ], "total": 8 } }`
- 修改时间：2026-11-19 13:45

## /api/chat
- HTTP 方法：POST
- 请求参数（JSON）：`{ "messages": [{ "role": "user", "content": "你们几点营业？" }], "provider": "qiniu", "mode": "service" }`
  - `messages`：必填，user / assistant 消息数组，最多取最后 20 条；system 人设由后端固定，不接受前端传入
  - `provider`：可选，`qiniu`（默认）或 `siliconflow`，对应 .env 中两套 Key / baseURL / model
  - `mode`：可选，`chat`（AI 助手）或 `service`（中华美食街客服人设）
  - 示例：`curl -X POST http://localhost:8904/api/chat -H "Content-Type: application/json" -d "{\"messages\":[{\"role\":\"user\",\"content\":\"你好\"}],\"provider\":\"siliconflow\",\"mode\":\"chat\"}"`
- 响应格式（成功）：`{ "code": 0, "msg": "ok", "data": { "reply": "您好！", "provider": "siliconflow", "providerLabel": "硅基流动", "model": "deepseek-ai/DeepSeek-V4-Flash", "mode": "chat", "usage": { "total_tokens": 30 } } }`
- 响应格式（失败，429 示例）：HTTP 429 `{ "code": 429, "msg": "免费模型请求过于频繁或额度已用完，请稍后再试，或切换到「硅基流动」继续对话", "data": { "provider": "qiniu", "model": "qiniu/conatus-free" } }`
- 其他错误码：400 参数为空 / 500 后端未配置 Key / 401 Key 无效 / 402 余额不足 / 404 模型名或 baseURL 错误 / 502 上游异常 / 504 模型响应超时
- 修改时间：2026-11-23 14:00

## /api/kb/upload
- HTTP 方法：POST（multipart/form-data）
- 请求参数：`file`（必填，doc/docx/ppt/pptx/pdf/txt/md，最大 10 MB）、`zjh_description`（选填，文档说明）
- 示例：`curl -X POST http://localhost:8904/api/kb/upload -F "file=@手册.docx" -F "zjh_description=门店服务手册"`
- 响应格式：`{ "code": 0, "msg": "上传并解析成功", "data": { "id": 9, "filename": "手册.docx", "chunkCount": 2, "textLength": 856 } }`
- 修改时间：2026-11-23 14:10

## /api/kb/list
- HTTP 方法：GET，请求参数：无
- 响应格式：`{ "code": 0, "msg": "ok", "data": { "list": [{ "id": 1, "zjh_filename": "zjh_service_manual.txt", "zjh_chunk_count": 1, "zjh_file_type": "txt" }], "total": 8 } }`
- 修改时间：2026-11-23 14:10

## /api/kb/:zjh_id
- HTTP 方法：DELETE
- 请求参数：路径参数 `zjh_id`（文档 id），同时删除该文档及其全部分片
- 示例：`curl -X DELETE http://localhost:8904/api/kb/9`
- 响应格式：`{ "code": 0, "msg": "删除成功", "data": { "id": 9 } }`
- 修改时间：2026-11-23 14:10

## /api/kb/ask
- HTTP 方法：POST（JSON）
- 请求参数：`zjh_question`（必填，问题）、`zjh_provider`（选填，`siliconflow` 默认 或 `qiniu`）
- 示例：`curl -X POST http://localhost:8904/api/kb/ask -H "Content-Type: application/json" -d "{\"zjh_question\":\"营业时间？\",\"zjh_provider\":\"siliconflow\"}"`
- 响应格式：`{ "code": 0, "msg": "ok", "data": { "answer": "每日10:00-22:00……", "sources": [{ "filename": "zjh_service_manual.txt", "chunkIndex": 0, "score": 17, "preview": "中华美食街营业时间……" }], "provider": "siliconflow", "model": "deepseek-ai/DeepSeek-V4-Flash" } }`
- 说明：检索 top3 片段拼入 system；发送给大模型与接收自大模型的数据打印到后端控制台
- 修改时间：2026-11-23 14:10

## /api/vision
- HTTP 方法：POST（multipart/form-data）
- 请求参数：`image`（必填，png/jpg/jpeg/webp/gif/bmp，最大 8 MB）；模型取 .env 的 `VISION_MODEL`（默认 Qwen/Qwen3-VL-8B-Instruct）
- 示例：`curl -X POST http://localhost:8904/api/vision -F "image=@photo.jpg"`
- 响应格式：`{ "code": 0, "msg": "ok", "data": { "description": "一张红色纯色图片", "filename": "photo.jpg", "model": "Qwen/Qwen3-VL-8B-Instruct", "usage": {} } }`
- 错误：400 表示图片过小（Qwen3-VL 要求宽高均大于 28 像素）或格式不支持；502/504 表示模型服务异常或超时
- 修改时间：2026-11-23 14:10

## /api/asr
- HTTP 方法：POST（multipart/form-data）
- 请求参数：`audio`（必填，wav/mp3/ogg/m4a/webm/flac/aac，最大 12 MB，建议 5 分钟以内）；模型取 .env 的 `QINIU_ASR_MODEL`（默认 qwen/qwen-audio-3.0-asr-flash），调用七牛 OpenAI 兼容接口并传 `input_audio`
- 示例：`curl -X POST http://localhost:8904/api/asr -F "audio=@meeting.wav"`
- 响应格式：`{ "code": 0, "msg": "ok", "data": { "text": "转写出来的文字", "filename": "meeting.wav", "model": "qwen/qwen-audio-3.0-asr-flash" } }`
- 错误格式：`{ "code": 502, "msg": "模型上游服务暂时不可用……", "data": null }`；429 表示限流
- 修改时间：2026-11-23 14:10

## /api/asr（修订：改用 /v1/audio/transcriptions）
- HTTP 方法：POST（multipart/form-data）
- 请求参数：`audio`（必填，wav/mp3/ogg/m4a/webm/flac/aac，最大 12 MB）；模型取 .env 的 `QINIU_ASR_MODEL`（qwen/qwen-audio-3.0-asr-flash）
- 后端转发地址：`POST {QINIU_BASE_URL}/audio/transcriptions`，请求头 `Authorization: Bearer <QINIU_API_KEY>`，表单字段 `file`（二进制）+ `model`
- 实测说明：之前用 `/v1/chat/completions` + `input_audio` 会被平台判为请求格式不对，返回 502；改为 OpenAI 标准转写接口后稳定返回文字
- 示例：`curl -X POST http://localhost:8904/api/asr -F "audio=@meeting.mp3"`
- 响应示例（实测）：
  ```json
  {
    "code": 0,
    "msg": "ok",
    "data": {
      "text": "七牛的文化是做一个简单的人，做一款简单的产品，做一家简单的公司。",
      "filename": "meeting.mp3",
      "model": "qwen/qwen-audio-3.0-asr-flash",
      "seconds": 8
    }
  }
  ```
- 错误格式：`{ "code": 401, "msg": "API Key 无效或未授权（401）：请检查 backend/.env 中 QINIU_API_KEY 是否复制完整。", "data": null }`；429 限流、413 文件过大、502 上游异常
- 控制台输出：`[ASR] ===== 发送给大模型的数据 start/end =====`（地址、模型、文件名、大小、表单字段）与 `[ASR] ===== 接收自大模型的数据 start/end =====`（HTTP 状态、耗时、原始响应），Key 一律脱敏
- 修改时间：2026-11-23 14:26

<!-- 后续接口记录追加于此 -->

## /api/chat（行为修订：429 自动重试）
- 变更内容：上游返回 429 时，后端按 3 秒、6 秒退避自动重试两次（共 3 次尝试），仍失败才把 429 返回前端；目的是避免七牛免费模型在全班共享额度下演示时偶发失败
- 429 提示文案更新为：`免费模型请求过于频繁（七牛 conatus-free 是共享免费额度，高峰时段容易限流），请稍等半分钟再试，或切换到「硅基流动」继续对话`
- 请求参数与响应格式不变
- 修改时间：2026-11-23 14:52
