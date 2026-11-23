/*
姓名：zjh | 学号：904 |
时间：2026-11-23 | 大模型：CodeBuddy (Tencent Hunyuan Hy)
*/
(function () {
  const zjh_ui = {
    form: document.getElementById('zjh_upload_form'),
    file: document.getElementById('zjh_kb_file'),
    desc: document.getElementById('zjh_kb_desc'),
    uploadBtn: document.getElementById('zjh_upload_btn'),
    status: document.getElementById('zjh_upload_status'),
    list: document.getElementById('zjh_doc_list'),
    total: document.getElementById('zjh_kb_total'),
    messages: document.getElementById('zjh_kb_messages'),
    thinking: document.getElementById('zjh_kb_thinking'),
    quick: document.getElementById('zjh_kb_quick'),
    question: document.getElementById('zjh_kb_question'),
    send: document.getElementById('zjh_kb_send'),
    provider: document.getElementById('zjh_kb_provider')
  };
  if (!zjh_ui.form || !zjh_ui.messages) return;

  const zjh_questions = ['中华美食街几点营业？', '有哪些招牌菜？', '项目端口是多少？', '401 错误是什么意思？'];
  let zjh_sending = false;

  function zjh_scroll_bottom() {
    zjh_ui.messages.scrollTop = zjh_ui.messages.scrollHeight;
  }

  function zjh_append(zjh_class, zjh_text) {
    const zjh_node = document.createElement('div');
    zjh_node.className = 'zjh_msg ' + zjh_class;
    zjh_node.textContent = zjh_text;
    zjh_ui.messages.appendChild(zjh_node);
    zjh_scroll_bottom();
    return zjh_node;
  }

  function zjh_show_status(zjh_text, zjh_is_error) {
    zjh_ui.status.textContent = zjh_text;
    zjh_ui.status.classList.toggle('zjh_status_error', !!zjh_is_error);
  }

  async function zjh_load_docs() {
    try {
      const zjh_response = await fetch('/api/kb/list');
      const zjh_result = await zjh_response.json();
      console.log('[zjh] /api/kb/list 返回:', zjh_result);
      if (zjh_result.code !== 0) throw new Error(zjh_result.msg);
      zjh_ui.list.innerHTML = '';
      zjh_ui.total.textContent = zjh_result.data.total + ' 份文档';
      zjh_result.data.list.forEach((zjh_doc) => {
        const zjh_item = document.createElement('div');
        zjh_item.className = 'zjh_doc_item';
        const zjh_head = document.createElement('div');
        zjh_head.className = 'zjh_doc_head';
        const zjh_name = document.createElement('strong');
        zjh_name.textContent = zjh_doc.zjh_filename;
        const zjh_del = document.createElement('button');
        zjh_del.className = 'zjh_doc_delete';
        zjh_del.type = 'button';
        zjh_del.textContent = '删除';
        zjh_del.dataset.zjhId = zjh_doc.id;
        zjh_head.append(zjh_name, zjh_del);
        const zjh_meta = document.createElement('small');
        zjh_meta.textContent = `${zjh_doc.zjh_file_type.toUpperCase()} · ${zjh_doc.zjh_chunk_count} 个片段 · ${zjh_doc.zjh_file_size} 字节`;
        zjh_item.append(zjh_head, zjh_meta);
        zjh_ui.list.appendChild(zjh_item);
      });
    } catch (zjh_error) {
      console.error('[zjh] 知识库列表加载失败:', zjh_error);
      zjh_show_status('知识库列表加载失败：' + zjh_error.message, true);
    }
  }

  zjh_ui.form.addEventListener('submit', async (zjh_event) => {
    zjh_event.preventDefault();
    if (!zjh_ui.file.files || !zjh_ui.file.files[0]) {
      zjh_show_status('请先选择一个文档', true);
      return;
    }
    const zjh_data = new FormData();
    zjh_data.append('file', zjh_ui.file.files[0]);
    zjh_data.append('zjh_description', zjh_ui.desc.value.trim());
    zjh_ui.uploadBtn.disabled = true;
    zjh_show_status('正在上传并解析文档…', false);
    console.log('[zjh] /api/kb/upload 发送:', zjh_ui.file.files[0].name);
    try {
      const zjh_response = await fetch('/api/kb/upload', { method: 'POST', body: zjh_data });
      const zjh_result = await zjh_response.json();
      console.log('[zjh] /api/kb/upload 返回:', zjh_result);
      if (zjh_result.code !== 0) throw new Error(zjh_result.msg);
      zjh_show_status(`上传成功：切出 ${zjh_result.data.chunkCount} 个片段`, false);
      zjh_ui.file.value = '';
      zjh_ui.desc.value = '';
      await zjh_load_docs();
    } catch (zjh_error) {
      console.error('[zjh] 上传失败:', zjh_error);
      zjh_show_status('上传失败：' + zjh_error.message, true);
    } finally {
      zjh_ui.uploadBtn.disabled = false;
    }
  });

  zjh_ui.list.addEventListener('click', async (zjh_event) => {
    const zjh_button = zjh_event.target.closest('.zjh_doc_delete');
    if (!zjh_button) return;
    if (!window.confirm('确定删除这份文档及其全部分片吗？')) return;
    try {
      const zjh_response = await fetch('/api/kb/' + zjh_button.dataset.zjhId, { method: 'DELETE' });
      const zjh_result = await zjh_response.json();
      console.log('[zjh] DELETE /api/kb/:id 返回:', zjh_result);
      if (zjh_result.code !== 0) throw new Error(zjh_result.msg);
      await zjh_load_docs();
    } catch (zjh_error) {
      console.error('[zjh] 删除失败:', zjh_error);
      zjh_show_status('删除失败：' + zjh_error.message, true);
    }
  });

  async function zjh_ask(zjh_text) {
    const zjh_question = (zjh_text || zjh_ui.question.value).trim();
    if (!zjh_question || zjh_sending) return;
    zjh_append('zjh_msg--user', zjh_question);
    zjh_ui.question.value = '';
    zjh_sending = true;
    zjh_ui.thinking.classList.add('zjh_thinking--show');
    zjh_ui.send.disabled = true;
    const zjh_payload = { zjh_question: zjh_question, zjh_provider: zjh_ui.provider.value };
    console.log('[zjh] /api/kb/ask 发送:', zjh_payload);
    try {
      const zjh_response = await fetch('/api/kb/ask', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(zjh_payload)
      });
      const zjh_result = await zjh_response.json();
      console.log('[zjh] /api/kb/ask 返回:', zjh_result);
      if (zjh_result.code !== 0) throw new Error(zjh_result.msg);
      zjh_append('zjh_msg--assistant', zjh_result.data.answer);
      const zjh_sources = document.createElement('div');
      zjh_sources.className = 'zjh_sources';
      zjh_result.data.sources.forEach((zjh_source) => {
        const zjh_item = document.createElement('div');
        zjh_item.className = 'zjh_source_item';
        zjh_item.textContent = `来源：${zjh_source.filename}（片段 ${zjh_source.chunkIndex + 1}，匹配分 ${zjh_source.score}） ${zjh_source.preview}…`;
        zjh_sources.appendChild(zjh_item);
      });
      zjh_ui.messages.appendChild(zjh_sources);
      zjh_scroll_bottom();
    } catch (zjh_error) {
      console.error('[zjh] 知识库问答失败:', zjh_error);
      zjh_append('zjh_msg--error', '出错了：' + zjh_error.message);
    } finally {
      zjh_sending = false;
      zjh_ui.thinking.classList.remove('zjh_thinking--show');
      zjh_ui.send.disabled = false;
    }
  }

  zjh_questions.forEach((zjh_text) => {
    const zjh_button = document.createElement('button');
    zjh_button.type = 'button';
    zjh_button.textContent = zjh_text;
    zjh_button.addEventListener('click', () => zjh_ask(zjh_text));
    zjh_ui.quick.appendChild(zjh_button);
  });

  zjh_ui.send.addEventListener('click', () => zjh_ask());
  zjh_ui.question.addEventListener('keydown', (zjh_event) => {
    if (zjh_event.key === 'Enter' && !zjh_event.shiftKey) {
      zjh_event.preventDefault();
      zjh_ask();
    }
  });

  zjh_load_docs();
})();
