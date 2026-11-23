/*
姓名：zjh | 学号：904 |
时间：2026-11-23 | 大模型：CodeBuddy (Tencent Hunyuan Hy)
*/
(function () {
  const zjh_file = document.getElementById('zjh_image_file');
  const zjh_btn = document.getElementById('zjh_vision_btn');
  const zjh_status = document.getElementById('zjh_vision_status');
  const zjh_preview = document.getElementById('zjh_image_preview');
  const zjh_box = document.getElementById('zjh_vision_result');
  const zjh_text = document.getElementById('zjh_vision_text');
  const zjh_model = document.getElementById('zjh_vision_model');
  if (!zjh_file || !zjh_btn) return;

  let zjh_preview_url = '';

  zjh_file.addEventListener('change', () => {
    if (zjh_preview_url) URL.revokeObjectURL(zjh_preview_url);
    zjh_preview_url = '';
    zjh_preview.hidden = true;
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
      zjh_status.textContent = '请先选择一张图片';
      return;
    }
    const zjh_data = new FormData();
    zjh_data.append('image', zjh_selected);
    zjh_btn.disabled = true;
    zjh_status.textContent = '正在识别…';
    console.log('[zjh] /api/vision 发送图片:', zjh_selected.name);
    try {
      const zjh_response = await fetch('/api/vision', { method: 'POST', body: zjh_data });
      const zjh_result = await zjh_response.json();
      console.log('[zjh] /api/vision 返回:', zjh_result);
      if (zjh_result.code !== 0) throw new Error(zjh_result.msg);
      zjh_box.classList.remove('zjh_result_error');
      zjh_text.textContent = zjh_result.data.description;
      zjh_model.textContent = '模型：' + zjh_result.data.model;
      zjh_status.textContent = '识别成功';
    } catch (zjh_error) {
      console.error('[zjh] 图像识别失败:', zjh_error);
      zjh_box.classList.add('zjh_result_error');
      zjh_text.textContent = '识别失败：' + zjh_error.message;
      zjh_status.textContent = '识别失败，请查看浏览器控制台';
    } finally {
      zjh_btn.disabled = false;
    }
  });
})();
