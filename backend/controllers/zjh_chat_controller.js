/*
姓名：zjh | 学号：904 |
时间：2026-11-23 | 大模型：CodeBuddy (Tencent Hunyuan Hy)
*/

// 客服人设（课堂任务二）：只回答营业时间、招牌菜、配送范围三类问题，其余引导留言
const ZJH_SERVICE_SYSTEM = [
  '你是「中华美食街」的在线客服小美，服务态度亲切、简洁。',
  '你只回答以下三类问题，其他问题一律不要回答：',
  '1. 营业时间：每天 10:00-22:00，周末照常营业。',
  '2. 招牌菜：糖醋鲤鱼（38元）、麻婆豆腐（22元）、小笼包（18元）、宫保鸡丁（32元）。',
  '3. 配送范围：门店周边 3 公里内可配送，满 30 元起送，超出范围欢迎到店品尝。',
  '规则：',
  '- 用户问上述三类问题时，直接依据上面的信息回答，不要编造未提供的信息。',
  '- 用户问其他任何问题（学习、天气、编程、其他店铺等）时，礼貌拒绝并引导留言：',
  '  抱歉，这个问题不在我的服务范围内，您可以留下联系方式，我们会尽快回复您。',
  '- 每次回答不超过 120 字，使用中文。'
].join('\n');

const ZJH_CHAT_SYSTEM = '你是一个有用的助手。请用简洁、友好的中文回答用户问题，回答尽量控制在 300 字以内。';

// 平台配置只在后端读取 .env，前端永远拿不到 Key
function zjh_get_provider_config(zjh_wanted_name) {
  const zjh_all = {
    siliconflow: {
      label: '硅基流动',
      apiKey: process.env.SILICONFLOW_API_KEY,
      baseURL: process.env.SILICONFLOW_BASE_URL || 'https://api.siliconflow.cn/v1',
      model: process.env.SILICONFLOW_MODEL || 'deepseek-ai/DeepSeek-V4-Flash'
    },
    qiniu: {
      label: '七牛云',
      apiKey: process.env.QINIU_API_KEY,
      baseURL: process.env.QINIU_BASE_URL || 'https://api.qnaigc.com/v1',
      model: process.env.QINIU_MODEL || 'qiniu/conatus-free'
    }
  };
  const zjh_default = zjh_all[process.env.LLM_DEFAULT_PROVIDER] ? process.env.LLM_DEFAULT_PROVIDER : 'qiniu';
  const zjh_name = zjh_all[zjh_wanted_name] ? zjh_wanted_name : zjh_default;
  return { name: zjh_name, ...zjh_all[zjh_name] };
}

// 把上游平台的错误翻译成同学能看懂的提示（课程第 4 节报错速查表）
function zjh_translate_upstream_error(zjh_status, zjh_message) {
  if (zjh_status === 401) {
    return { code: 401, msg: 'API Key 无效或未授权，请检查 backend/.env 中的 Key 是否正确（Bearer 后不要带空格）' };
  }
  if (zjh_status === 402) {
    return { code: 402, msg: '账户余额不足或未领取免费额度，请到平台领取奖励券或切换另一个平台' };
  }
  if (zjh_status === 404) {
    return { code: 404, msg: '模型名或接口地址有误，请检查 baseURL 是否以 /v1 结尾、model 是否拼写正确' };
  }
  if (zjh_status === 429) {
    return { code: 429, msg: '免费模型请求过于频繁（七牛 conatus-free 是共享免费额度，高峰时段容易限流），请稍等半分钟再试，或切换到「硅基流动」继续对话' };
  }
  return { code: 502, msg: `模型接口暂时不可用（HTTP ${zjh_status}）：${zjh_message}` };
}

async function zjh_chat(zjh_req, zjh_res) {
  const zjh_start = Date.now();
  const zjh_provider = zjh_get_provider_config(zjh_req.body && zjh_req.body.provider);
  const zjh_mode = (zjh_req.body && zjh_req.body.mode) === 'service' ? 'service' : 'chat';
  let zjh_messages = zjh_req.body && zjh_req.body.messages;

  if (!Array.isArray(zjh_messages) || zjh_messages.length === 0) {
    return zjh_res.status(400).json({ code: 400, msg: 'messages 不能为空，请发送对话内容', data: null });
  }

  // 只接受 user / assistant  historical 消息，system 人设由后端决定，防止前端注入
  zjh_messages = zjh_messages
    .filter((zjh_item) => zjh_item && (zjh_item.role === 'user' || zjh_item.role === 'assistant') && typeof zjh_item.content === 'string')
    .slice(-20)
    .map((zjh_item) => ({ role: zjh_item.role, content: zjh_item.content.trim().slice(0, 2000) }))
    .filter((zjh_item) => zjh_item.content.length > 0);

  if (zjh_messages.length === 0) {
    return zjh_res.status(400).json({ code: 400, msg: '没有有效的用户消息', data: null });
  }

  if (!zjh_provider.apiKey || zjh_provider.apiKey.indexOf('sk-你的') === 0) {
    return zjh_res.status(500).json({ code: 500, msg: '后端尚未配置该平台的 API Key，请在 backend/.env 中填写并重启服务', data: null });
  }

  const zjh_payload = {
    model: zjh_provider.model,
    messages: [{ role: 'system', content: zjh_mode === 'service' ? ZJH_SERVICE_SYSTEM : ZJH_CHAT_SYSTEM }, ...zjh_messages],
    temperature: 0.7,
    max_tokens: 1024,
    stream: false
  };

  try {
    let zjh_upstream = null;
    let zjh_text = '';
    let zjh_result = null;
    // 免费模型（尤其七牛 conatus-free）经常触发 429 限流，按 3 秒、6 秒退避重试两次
    const zjh_retry_delays = [3000, 6000];
    const zjh_max_attempt = zjh_retry_delays.length + 1;

    for (let zjh_attempt = 1; zjh_attempt <= zjh_max_attempt; zjh_attempt += 1) {
      zjh_upstream = await fetch(`${zjh_provider.baseURL.replace(/\/+$/, '')}/chat/completions`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${zjh_provider.apiKey}`
        },
        body: JSON.stringify(zjh_payload),
        signal: AbortSignal.timeout(60000)
      });

      zjh_text = await zjh_upstream.text();
      try { zjh_result = JSON.parse(zjh_text); } catch (zjh_parse_error) { zjh_result = null; }

      if (zjh_upstream.status === 429 && zjh_attempt < zjh_max_attempt) {
        const zjh_wait = zjh_retry_delays[zjh_attempt - 1];
        console.warn(`[chat] ${zjh_provider.name} 触发限流（429），${zjh_wait}ms 后自动重试（第 ${zjh_attempt + 1}/${zjh_max_attempt} 次）`);
        await new Promise((zjh_resolve) => setTimeout(zjh_resolve, zjh_wait));
        continue;
      }
      break;
    }

    if (!zjh_upstream.ok) {
      const zjh_upstream_msg = (zjh_result && zjh_result.error && (zjh_result.error.message || zjh_result.error.code)) || zjh_text.slice(0, 200);
      console.error(`[chat] ${zjh_provider.name} 上游错误 HTTP ${zjh_upstream.status}:`, zjh_upstream_msg);
      const zjh_failed = zjh_translate_upstream_error(zjh_upstream.status, zjh_upstream_msg);
      return zjh_res.status(zjh_failed.code >= 400 && zjh_failed.code < 600 ? zjh_failed.code : 502)
        .json({ code: zjh_failed.code, msg: zjh_failed.msg, data: { provider: zjh_provider.name, model: zjh_provider.model } });
    }

    let zjh_reply = zjh_result && zjh_result.choices && zjh_result.choices[0] && zjh_result.choices[0].message
      ? zjh_result.choices[0].message.content
      : '';
    if (typeof zjh_reply !== 'string' || zjh_reply.trim() === '') {
      throw new Error('模型返回内容为空，请稍后重试');
    }
    // 部分推理模型会把 <think>...</think> 拼进 content，这里只保留最终回答
    if (zjh_reply.indexOf('</think>') !== -1) {
      zjh_reply = zjh_reply.split('</think>').pop().trim();
    }

    console.log(`[chat] ${zjh_provider.name} / ${zjh_provider.model} 回答成功，耗时 ${Date.now() - zjh_start}ms`);
    return zjh_res.json({
      code: 0,
      msg: 'ok',
      data: {
        reply: zjh_reply,
        provider: zjh_provider.name,
        providerLabel: zjh_provider.label,
        model: zjh_provider.model,
        mode: zjh_mode,
        usage: zjh_result.usage || null
      }
    });
  } catch (zjh_error) {
    console.error('[chat] 请求失败:', zjh_error.message);
    const zjh_timeout = zjh_error.name === 'TimeoutError' || zjh_error.name === 'AbortError';
    return zjh_res.status(504).json({
      code: 504,
      msg: zjh_timeout ? '模型响应超时，请稍后重试或切换平台' : '请求模型失败：' + zjh_error.message,
      data: null
    });
  }
}

module.exports = { zjh_chat };
