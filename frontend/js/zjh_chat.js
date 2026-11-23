/*
姓名：zjh | 学号：904 |
时间：2026-11-23 | 大模型：CodeBuddy (Tencent Hunyuan Hy)
*/
(function () {
  const zjh_elements = {
    provider: document.getElementById('zjh_provider_select'),
    mode: document.getElementById('zjh_mode_select'),
    model: document.getElementById('zjh_model_label'),
    persona: document.getElementById('zjh_persona_label'),
    count: document.getElementById('zjh_msg_count'),
    clear: document.getElementById('zjh_clear_btn'),
    messages: document.getElementById('zjh_messages'),
    welcome: document.getElementById('zjh_welcome'),
    thinking: document.getElementById('zjh_thinking'),
    quick: document.getElementById('zjh_quick'),
    input: document.getElementById('zjh_input'),
    send: document.getElementById('zjh_send_btn'),
    title: document.getElementById('zjh_chat_title'),
    subtitle: document.getElementById('zjh_chat_subtitle'),
    tip: document.getElementById('zjh_chat_tip')
  };
  if (!zjh_elements.messages || !zjh_elements.send) return;

  const zjh_provider_info = {
    qiniu: { label: '七牛云', model: 'qiniu/conatus-free' },
    siliconflow: { label: '硅基流动', model: 'deepseek-ai/DeepSeek-V4-Flash' }
  };
  const zjh_persona_info = {
    chat: {
      label: 'AI 助手',
      title: 'AI 助手在线',
      subtitle: '有什么可以帮你的？',
      welcome: '你好！我是你的 AI 助手，试试问我一个问题吧。',
      quick: ['你好，请介绍一下你自己', '我刚才问了什么？', '用一句话解释什么是 API'],
      tip: '提示：连续问"我刚才问了什么"，可以验证多轮对话是否生效。'
    },
    service: {
      label: '美食街客服',
      title: '中华美食街 · 客服小美在线',
      subtitle: '营业时间 / 招牌菜 / 配送范围，其他问题会引导留言',
      welcome: '您好！我是中华美食街客服小美，可以为您介绍营业时间、招牌菜和配送范围。',
      quick: ['你们几点营业？', '有什么招牌菜？', '配送范围有多大？', '今天天气怎么样？'],
      tip: '试试最后一条"今天天气怎么样？"：客服人设应礼貌拒答并引导留言。'
    }
  };

  let zjh_history = [];
  let zjh_sending = false;

  function zjh_scroll_bottom() {
    zjh_elements.messages.scrollTop = zjh_elements.messages.scrollHeight;
  }

  function zjh_append_message(zjh_role, zjh_text) {
    const zjh_bubble = document.createElement('div');
    zjh_bubble.className = 'zjh_msg zjh_msg--' + zjh_role;
    zjh_bubble.textContent = zjh_text;
    zjh_elements.messages.appendChild(zjh_bubble);
    zjh_scroll_bottom();
    return zjh_bubble;
  }

  function zjh_update_count() {
    zjh_elements.count.textContent = zjh_history.length + ' 条';
  }

  function zjh_render_quick(zjh_mode) {
    zjh_elements.quick.innerHTML = '';
    zjh_persona_info[zjh_mode].quick.forEach((zjh_question) => {
      const zjh_button = document.createElement('button');
      zjh_button.type = 'button';
      zjh_button.textContent = zjh_question;
      zjh_button.addEventListener('click', () => zjh_send(zjh_question));
      zjh_elements.quick.appendChild(zjh_button);
    });
  }

  function zjh_apply_mode(zjh_mode, zjh_reset) {
    const zjh_persona = zjh_persona_info[zjh_mode];
    zjh_elements.persona.textContent = zjh_persona.label;
    zjh_elements.title.textContent = zjh_persona.title;
    zjh_elements.subtitle.textContent = zjh_persona.subtitle;
    zjh_elements.welcome.textContent = zjh_persona.welcome;
    zjh_elements.tip.textContent = zjh_persona.tip;
    zjh_render_quick(zjh_mode);
    if (zjh_reset) {
      zjh_history = [];
      zjh_elements.messages.innerHTML = '';
      zjh_elements.messages.appendChild(zjh_elements.welcome);
      zjh_update_count();
    }
  }

  function zjh_apply_provider(zjh_provider) {
    zjh_elements.model.textContent = zjh_provider_info[zjh_provider].model;
  }

  function zjh_set_thinking(zjh_visible) {
    zjh_elements.thinking.classList.toggle('zjh_thinking--show', zjh_visible);
    zjh_elements.send.disabled = zjh_visible;
    zjh_send = zjh_visible;
  }

  async function zjh_send(zjh_text) {
    const zjh_question = (zjh_text || zjh_elements.input.value).trim();
    if (!zjh_question || zjh_sending) return;

    zjh_append_message('user', zjh_question);
    zjh_history.push({ role: 'user', content: zjh_question });
    zjh_update_count();
    zjh_elements.input.value = '';
    zjh_set_thinking(true);

    const zjh_provider = zjh_elements.provider.value;
    const zjh_mode = zjh_elements.mode.value;
    const zjh_payload = { messages: zjh_history.slice(), provider: zjh_provider, mode: zjh_mode };
    console.log('[zjh] /api/chat 请求:', zjh_payload);

    try {
      const zjh_response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(zjh_payload)
      });
      const zjh_result = await zjh_response.json();
      console.log('[zjh] /api/chat 返回:', zjh_result);

      if (zjh_result.code !== 0 || !zjh_result.data || !zjh_result.data.reply) {
        throw new Error(zjh_result.msg || '接口返回格式异常');
      }

      zjh_append_message('assistant', zjh_result.data.reply);
      zjh_history.push({ role: 'assistant', content: zjh_result.data.reply });
      zjh_update_count();
      if (zjh_result.data.model) {
        zjh_elements.model.textContent = zjh_result.data.model;
      }
    } catch (zjh_error) {
      console.error('[zjh] /api/chat 请求失败:', zjh_error);
      zjh_append_message('error', '出错了：' + zjh_error.message + '\n（请检查后端服务是否运行、.env 的 Key 是否有效，或切换平台重试）');
      if (zjh_history.length > 0 && zjh_history[zjh_history.length - 1].role === 'user') {
        zjh_history.pop();
        zjh_update_count();
      }
    } finally {
      zjh_set_thinking(false);
      zjh_elements.input.focus();
    }
  }

  zjh_elements.provider.addEventListener('change', () => {
    zjh_apply_provider(zjh_elements.provider.value);
    zjh_append_message('assistant', '已切换到「' + zjh_provider_info[zjh_elements.provider.value].label + '」，上下文对话已保留，可以继续提问。');
  });

  zjh_elements.mode.addEventListener('change', () => {
    zjh_apply_mode(zjh_elements.mode.value, true);
    zjh_append_message('assistant', '已切换人设，对话记录已清空，人设由后端 system 消息控制。');
  });

  zjh_elements.clear.addEventListener('click', () => {
    zjh_apply_mode(zjh_elements.mode.value, true);
  });

  zjh_elements.send.addEventListener('click', () => zjh_send());

  zjh_elements.input.addEventListener('keydown', (zjh_event) => {
    if (zjh_event.key === 'Enter' && !zjh_event.shiftKey) {
      zjh_event.preventDefault();
      zjh_send();
    }
  });

  zjh_apply_provider(zjh_elements.provider.value);
  zjh_apply_mode(zjh_elements.mode.value, false);
})();
