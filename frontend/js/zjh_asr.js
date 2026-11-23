/*
姓名：zjh | 学号：904 |
时间：2026-11-23 | 大模型：CodeBuddy (Tencent Hunyuan Hy)
*/
(function () {
  const zjh_file = document.getElementById('zjh_audio_file');
  const zjh_btn = document.getElementById('zjh_asr_btn');
  const zjh_status = document.getElementById('zjh_asr_status');
  const zjh_preview = document.getElementById('zjh_audio_preview');
  const zjh_box = document.getElementById('zjh_asr_result');
  const zjh_text = document.getElementById('zjh_asr_text');
  const zjh_model = document.getElementById('zjh_asr_model');
  if (!zjh_file || !zjh_btn) return;

  let zjh_preview_url = '';

  zjh_file.addEventListener('change', () => {
    if (zjh_preview_url) URL.revokeObjectURL(zjh_preview_url);
    zjh_preview_url = '';
    zjh_preview.hidden = true;
    zjh_preview.removeAttribute('src');
    const zjh_selected = zjh_file.files && zjh_file.files[0];
    if (!zjh_selected) return;
    zjh_preview_url = URL.createObjectURL(zjh_selected);
    zjh_preview.src = zjh_preview_url;
    zjh_preview.hidden = false;
    zjh_status.textContent = '已选择：' + zjh_selected.name;
    zjh_box.classList.remove('zjh_result_error');
  });

  zjh_btn.addEventListener('click', async () => {
    const zjh_selected = zjh_file.files && zjh_file.files[0];
    if (!zjh_selected) {
      zjh_status.textContent = '请先选择一段音频';
      return;
    }
    const zjh_data = new FormData();
    zjh_data.append('audio', zjh_selected);
    zjh_btn.disabled = true;
    zjh_status.textContent = '正在转写，最长可能需要 1 分钟…';
    console.log('[zjh] /api/asr 发送音频:', zjh_selected.name);
    try {
      const zjh_response = await fetch('/api/asr', { method: 'POST', body: zjh_data });
      const zjh_result = await zjh_response.json();
      console.log('[zjh] /api/asr 返回:', zjh_result);
      if (zjh_result.code !== 0) throw new Error(zjh_result.msg);
      zjh_box.classList.remove('zjh_result_error');
      zjh_text.textContent = zjh_result.data.text || '（未检测到有效语音）';
      zjh_model.textContent = '模型：' + zjh_result.data.model
        + (zjh_result.data.seconds ? '　音频时长：' + zjh_result.data.seconds + ' 秒' : '');
      zjh_status.textContent = '转写成功';
    } catch (zjh_error) {
      console.error('[zjh] 语音识别失败:', zjh_error);
      zjh_box.classList.add('zjh_result_error');
      zjh_text.textContent = '转写失败：' + zjh_error.message;
      zjh_status.textContent = '转写失败，请查看浏览器控制台';
    } finally {
      zjh_btn.disabled = false;
    }
  });
})();
