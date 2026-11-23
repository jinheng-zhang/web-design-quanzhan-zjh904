/*
姓名：zjh | 学号：904 |
时间：2026-11-19 | 大模型：CodeBuddy (Tencent Hunyuan Hy)
*/
document.addEventListener('DOMContentLoaded', () => {
  const zjh_form = document.getElementById('zjh_db_form');
  const zjh_result = document.getElementById('zjh_db_result');
  if (!zjh_form || !zjh_result) return;

  function zjh_show_result(zjh_ok, zjh_text) {
    zjh_result.textContent = zjh_text;
    zjh_result.className = 'zjh_result zjh_result--show ' + (zjh_ok ? 'zjh_result--success' : 'zjh_result--error');
    if (zjh_ok) console.log('[zjh] 数据库连接成功:', zjh_text);
    else console.error('[zjh] 数据库连接失败:', zjh_text);
  }

  zjh_form.addEventListener('submit', async (zjh_event) => {
    zjh_event.preventDefault();
    const zjh_button = zjh_form.querySelector('button');
    zjh_button.disabled = true;
    zjh_result.className = 'zjh_result';

    try {
      const zjh_response = await fetch('http://localhost:8904/api/db-test', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          username: document.getElementById('zjh_db_username').value.trim(),
          password: document.getElementById('zjh_db_password').value
        })
      });
      const zjh_data = await zjh_response.json();
      console.log('[zjh] /api/db-test 返回:', zjh_data);
      if (zjh_data.code === 0) {
        zjh_show_result(true, `连接成功\n数据库版本：${zjh_data.data.version}\n主机：${zjh_data.data.host}`);
      } else {
        zjh_show_result(false, `连接失败：${zjh_data.msg}`);
      }
    } catch (zjh_error) {
      console.error('[zjh] 请求 /api/db-test 出错:', zjh_error);
      zjh_show_result(false, `请求失败：${zjh_error.message}`);
    } finally {
      zjh_button.disabled = false;
    }
  });
});
