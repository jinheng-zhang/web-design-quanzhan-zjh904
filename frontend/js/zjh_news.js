/*
姓名：zjh | 学号：904 |
时间：2026-11-19 | 大模型：CodeBuddy (Tencent Hunyuan Hy)
*/
document.addEventListener('DOMContentLoaded', async () => {
  const zjh_list = document.getElementById('zjh_news_list');
  const zjh_total = document.getElementById('zjh_news_total');
  if (!zjh_list || !zjh_total) return;

  try {
    const zjh_response = await fetch('http://localhost:8904/api/news');
    const zjh_result = await zjh_response.json();
    console.log('[zjh] /api/news 返回:', zjh_result);

    if (zjh_result.code !== 0 || !Array.isArray(zjh_result.data.list)) {
      throw new Error(zjh_result.msg || '接口返回格式异常');
    }

    zjh_list.innerHTML = '';
    zjh_total.textContent = `共 ${zjh_result.data.total} 条`;
    zjh_result.data.list.forEach((zjh_item) => {
      const zjh_article = document.createElement('article');
      zjh_article.className = 'zjh_news-item';

      const zjh_title = document.createElement('h3');
      zjh_title.textContent = zjh_item.title;

      const zjh_summary = document.createElement('p');
      zjh_summary.textContent = zjh_item.summary;

      const zjh_source = document.createElement('div');
      zjh_source.className = 'zjh_news-source';
      zjh_source.textContent = `${zjh_item.source} · ${new Date(zjh_item.publish_time).toLocaleString('zh-CN')}`;

      zjh_article.append(zjh_title, zjh_summary, zjh_source);
      zjh_list.appendChild(zjh_article);
    });
  } catch (zjh_error) {
    console.error('[zjh] 新闻数据加载失败:', zjh_error);
    zjh_total.textContent = '加载失败';
    zjh_list.innerHTML = '<div class="zjh_empty">新闻数据加载失败，请检查后端服务与接口地址。</div>';
  }
});
