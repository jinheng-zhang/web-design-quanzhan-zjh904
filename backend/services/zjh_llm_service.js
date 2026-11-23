/*
姓名：zjh | 学号：904 |
时间：2026-11-23 | 大模型：CodeBuddy (Tencent Hunyuan Hy)
*/

// 统一的大模型调用服务：知识库问答、图像识别、语音识别共用
// 所有 Key 只在后端从 .env 读取；发送给大模型与接收自大模型的数据全部输出到控制台

function zjh_get_provider(zjh_name) {
  const zjh_all = {
    siliconflow: {
      label: '硅基流动',
      apiKey: process.env.SILICONFLOW_API_KEY,
      baseURL: process.env.SILICONFLOW_BASE_URL || 'https://api.siliconflow.cn/v1'
    },
    qiniu: {
      label: '七牛云',
      apiKey: process.env.QINIU_API_KEY,
      baseURL: process.env.QINIU_BASE_URL || 'https://api.qnaigc.com/v1'
    }
  };
  const zjh_key = zjh_all[zjh_name] ? zjh_name : 'siliconflow';
  return { name: zjh_key, ...zjh_all[zjh_key] };
}

function zjh_mask_long_value(zjh_value, zjh_limit) {
  if (typeof zjh_value !== 'string') return zjh_value;
  return zjh_value.length > zjh_limit ? zjh_value.slice(0, zjh_limit) + `...（共 ${zjh_value.length} 字符，已省略）` : zjh_value;
}

function zjh_log_payload(zjh_payload) {
  return JSON.parse(JSON.stringify(zjh_payload, (zjh_key, zjh_value) => {
    if (zjh_key === 'url' && typeof zjh_value === 'string' && zjh_value.startsWith('data:')) {
      return zjh_mask_long_value(zjh_value, 80);
    }
    if (zjh_key === 'data' && typeof zjh_value === 'string' && zjh_value.startsWith('data:')) {
      return zjh_mask_long_value(zjh_value, 80);
    }
    if (zjh_key === 'content' && typeof zjh_value === 'string') {
      return zjh_mask_long_value(zjh_value, 1500);
    }
    return zjh_value;
  }));
}

function zjh_translate_error(zjh_status, zjh_message) {
  if (zjh_status === 401) return 'API Key 无效或未授权，请检查 backend/.env 中的 Key';
  if (zjh_status === 402) return '账户余额不足或未领取免费额度';
  if (zjh_status === 403) return '模型未开通或当前 Key 无权限调用该模型（403）';
  if (zjh_status === 404) return '模型名或接口地址有误，请检查 baseURL 是否以 /v1 结尾';
  if (zjh_status === 429) return '请求过于频繁或免费额度已用完，请稍后重试';
  if (zjh_status === 502) return '模型上游服务暂时不可用，请稍后重试';
  if (zjh_status === 504) return '模型响应超时，请稍后重试';
  return `模型接口返回错误（HTTP ${zjh_status}）：${zjh_message}`;
}

async function zjh_call_llm(zjh_options) {
  const zjh_provider = zjh_get_provider(zjh_options.zjh_provider);
  const zjh_model = zjh_options.zjh_model;
  const zjh_payload = {
    model: zjh_model,
    messages: zjh_options.zjh_messages,
    temperature: typeof zjh_options.zjh_temperature === 'number' ? zjh_options.zjh_temperature : 0.3,
    max_tokens: zjh_options.zjh_max_tokens || 1024,
    stream: false
  };
  if (zjh_options.zjh_extra && typeof zjh_options.zjh_extra === 'object') {
    Object.assign(zjh_payload, zjh_options.zjh_extra);
  }

  console.log('[LLM] ===== 发送给大模型的数据 start =====');
  console.log(JSON.stringify(zjh_log_payload(zjh_payload), null, 2).slice(0, 8000));
  console.log('[LLM] ===== 发送给大模型的数据 end =====');

  if (!zjh_provider.apiKey) {
    return { ok: false, status: 500, msg: '后端尚未配置该平台的 API Key，请在 backend/.env 中填写并重启服务' };
  }

  try {
    const zjh_response = await fetch(`${zjh_provider.baseURL.replace(/\/+$/, '')}/chat/completions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${zjh_provider.apiKey}`
      },
      body: JSON.stringify(zjh_payload),
      signal: AbortSignal.timeout(zjh_options.zjh_timeout || 90000)
    });
    const zjh_text = await zjh_response.text();
    console.log('[LLM] ===== 接收自大模型的数据 start =====');
    console.log(zjh_mask_long_value(zjh_text, 8000));
    console.log('[LLM] ===== 接收自大模型的数据 end =====');

    let zjh_result = null;
    try { zjh_result = JSON.parse(zjh_text); } catch (zjh_error) { zjh_result = null; }

    if (!zjh_response.ok) {
      const zjh_upstream_msg = zjh_result && zjh_result.error && (zjh_result.error.message || zjh_result.error.code) || zjh_text.slice(0, 200);
      console.error(`[LLM] 上游错误 HTTP ${zjh_response.status}:`, zjh_upstream_msg);
      return { ok: false, status: zjh_response.status, msg: zjh_translate_error(zjh_response.status, zjh_upstream_msg) };
    }

    const zjh_reply = zjh_result && zjh_result.choices && zjh_result.choices[0] && zjh_result.choices[0].message
      ? zjh_result.choices[0].message.content : '';
    if (typeof zjh_reply !== 'string' || zjh_reply.trim() === '') {
      return { ok: false, status: 502, msg: '模型返回内容为空，请稍后重试' };
    }
    return { ok: true, data: { reply: zjh_reply, provider: zjh_provider.name, model: zjh_model, usage: zjh_result.usage || null } };
  } catch (zjh_error) {
    const zjh_timeout = zjh_error.name === 'TimeoutError' || zjh_error.name === 'AbortError';
    console.error('[LLM] 请求失败:', zjh_error.message);
    return { ok: false, status: 504, msg: zjh_timeout ? '模型响应超时，请稍后重试' : '请求模型失败：' + zjh_error.message };
  }
}

module.exports = { zjh_call_llm, zjh_get_provider, zjh_translate_error };
