/*
姓名：zjh | 学号：904 |
时间：2026-11-23 | 大模型：CodeBuddy (Tencent Hunyuan Hy)
*/
const path = require('path');

// 七牛 ASR 走 OpenAI 兼容的 /v1/audio/transcriptions（multipart 表单），
// 不是 /v1/chat/completions + input_audio，这是实测确认的正确调用方式。
const zjh_mime_map = {
  '.wav': 'audio/wav', '.mp3': 'audio/mpeg', '.ogg': 'audio/ogg',
  '.m4a': 'audio/mp4', '.webm': 'audio/webm', '.flac': 'audio/flac', '.aac': 'audio/aac'
};

function zjh_mask(zjh_text) {
  const zjh_key = process.env.QINIU_API_KEY || '';
  let zjh_out = String(zjh_text || '');
  if (zjh_key) zjh_out = zjh_out.split(zjh_key).join('sk-****');
  return zjh_out.replace(/sk-[A-Za-z0-9_-]{6,}/g, 'sk-****');
}

function zjh_map_error(zjh_status, zjh_raw) {
  const zjh_map = {
    401: 'API Key 无效或未授权（401）：请检查 backend/.env 中 QINIU_API_KEY 是否复制完整。',
    402: '账户余额不足（402）：请到七牛云控制台领取免费额度或充值后重试。',
    403: '没有权限（403）：请确认账号已开通 qwen-audio-3.0-asr-flash 模型。',
    404: '模型或接口不存在（404）：请确认 QINIU_ASR_MODEL=qwen/qwen-audio-3.0-asr-flash。',
    413: '音频文件过大（413）：请压缩到 25MB 以内再上传。',
    429: '请求过于频繁（429）：免费额度触发限流，请稍等几秒再试。'
  };
  if (zjh_map[zjh_status]) return zjh_map[zjh_status];
  if (zjh_status >= 500) return `七牛语音服务暂时不可用（${zjh_status}），请稍后重试。`;
  return `语音识别接口返回异常（${zjh_status}）：${zjh_mask(zjh_raw).slice(0, 160)}`;
}

// 上传音频 → multipart 转发给七牛 /v1/audio/transcriptions → 返回文字
async function zjh_asr_transcribe(zjh_req, zjh_res) {
  if (!zjh_req.file) {
    return zjh_res.status(400).json({ code: 400, msg: '请选择要识别的音频文件', data: null });
  }

  const zjh_api_key = process.env.QINIU_API_KEY || '';
  const zjh_base = (process.env.QINIU_BASE_URL || 'https://api.qnaigc.com/v1').replace(/\/+$/, '');
  const zjh_model = process.env.QINIU_ASR_MODEL || 'qwen/qwen-audio-3.0-asr-flash';

  if (!zjh_api_key || zjh_api_key.includes('你的')) {
    return zjh_res.status(500).json({
      code: 500,
      msg: '后端未配置 QINIU_API_KEY，请在 backend/.env 中填写后重启服务',
      data: null
    });
  }

  const zjh_ext = path.extname(zjh_req.file.originalname).toLowerCase() || '.wav';
  const zjh_mime = zjh_mime_map[zjh_ext] || 'application/octet-stream';
  const zjh_url = `${zjh_base}/audio/transcriptions`;

  const zjh_form = new FormData();
  zjh_form.append('file', new Blob([zjh_req.file.buffer], { type: zjh_mime }), zjh_req.file.originalname);
  zjh_form.append('model', zjh_model);

  console.log('\n[ASR] ===== 发送给大模型的数据 start =====');
  console.log(`[ASR] 请求地址: POST ${zjh_url}`);
  console.log(`[ASR] 模型: ${zjh_model}`);
  console.log(`[ASR] 文件: ${zjh_req.file.originalname} | 类型: ${zjh_mime} | 大小: ${zjh_req.file.size} 字节`);
  console.log(`[ASR] 表单字段: ${JSON.stringify({ model: zjh_model, file: `<二进制 ${zjh_req.file.size} 字节，已省略>` })}`);
  console.log('[ASR] ===== 发送给大模型的数据 end =====');

  const zjh_start = Date.now();
  let zjh_status = 0;
  let zjh_raw = '';
  try {
    const zjh_resp = await fetch(zjh_url, {
      method: 'POST',
      headers: { Authorization: `Bearer ${zjh_api_key}` },
      body: zjh_form,
      signal: AbortSignal.timeout(180000)
    });
    zjh_status = zjh_resp.status;
    zjh_raw = await zjh_resp.text();
  } catch (zjh_err) {
    const zjh_msg = zjh_err.name === 'TimeoutError'
      ? '语音识别超时（180 秒），请缩短音频时长后重试'
      : `无法连接七牛语音服务：${zjh_mask(zjh_err.message)}`;
    console.error('[ASR] 请求异常:', zjh_msg);
    return zjh_res.status(502).json({ code: 502, msg: zjh_msg, data: null });
  }

  console.log('\n[ASR] ===== 接收自大模型的数据 start =====');
  console.log(`[ASR] HTTP ${zjh_status} | 耗时 ${Date.now() - zjh_start} ms`);
  console.log(zjh_mask(zjh_raw).slice(0, 2000));
  console.log('[ASR] ===== 接收自大模型的数据 end =====\n');

  let zjh_json = null;
  try {
    zjh_json = JSON.parse(zjh_raw);
  } catch (_zjh_e) {
    zjh_json = null;
  }

  if (zjh_status !== 200) {
    const zjh_detail = zjh_json && zjh_json.error ? (zjh_json.error.message || '') : zjh_raw;
    const zjh_msg = zjh_map_error(zjh_status, zjh_detail);
    console.error('[ASR] 失败:', zjh_msg);
    return zjh_res.status(zjh_status >= 500 ? 502 : zjh_status).json({ code: zjh_status, msg: zjh_msg, data: null });
  }

  const zjh_text = (zjh_json && typeof zjh_json.text === 'string') ? zjh_json.text.trim() : '';
  if (!zjh_text) {
    return zjh_res.json({
      code: 0,
      msg: '识别完成，但未检测到有效语音内容',
      data: { text: '', filename: zjh_req.file.originalname, model: zjh_model, seconds: null }
    });
  }

  return zjh_res.json({
    code: 0,
    msg: 'ok',
    data: {
      text: zjh_text,
      filename: zjh_req.file.originalname,
      model: zjh_model,
      seconds: zjh_json && zjh_json.usage ? (zjh_json.usage.seconds || null) : null
    }
  });
}

module.exports = { zjh_asr_transcribe };
