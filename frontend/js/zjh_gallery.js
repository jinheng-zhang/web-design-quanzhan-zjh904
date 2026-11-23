/*
姓名：zjh | 学号：904 |
时间：2026-11-19 | 大模型：CodeBuddy (Tencent Hunyuan Hy)
*/
document.addEventListener('DOMContentLoaded', async () => {
  const zjh_grid = document.getElementById('zjh_gallery_grid');
  const zjh_total = document.getElementById('zjh_gallery_total');
  if (!zjh_grid || !zjh_total) return;

  function zjh_make_fallback(zjh_card) {
    const zjh_placeholder = document.createElement('div');
    zjh_placeholder.className = 'zjh_gallery-cover--fallback';
    zjh_placeholder.textContent = '图片暂不可用';
    zjh_placeholder.style.display = 'grid';
    zjh_placeholder.style.placeItems = 'center';
    zjh_placeholder.style.color = '#97a5c9';
    zjh_card.replaceChild(zjh_placeholder, zjh_card.querySelector('.zjh_gallery-cover'));
  }

  try {
    const zjh_response = await fetch('http://localhost:8904/api/gallery');
    const zjh_result = await zjh_response.json();
    console.log('[zjh] /api/gallery 返回:', zjh_result);

    if (zjh_result.code !== 0 || !Array.isArray(zjh_result.data.list)) {
      throw new Error(zjh_result.msg || '接口返回格式异常');
    }

    zjh_grid.innerHTML = '';
    zjh_total.textContent = `共 ${zjh_result.data.total} 条`;
    zjh_result.data.list.forEach((zjh_item) => {
      const zjh_card = document.createElement('article');
      zjh_card.className = 'zjh_gallery-card';

      const zjh_img = document.createElement('img');
      zjh_img.className = 'zjh_gallery-cover';
      zjh_img.src = zjh_item.img_url;
      zjh_img.alt = zjh_item.title;
      zjh_img.loading = 'lazy';
      zjh_img.addEventListener('error', () => zjh_make_fallback(zjh_card));

      const zjh_body = document.createElement('div');
      zjh_body.className = 'zjh_gallery-body';

      const zjh_title = document.createElement('h3');
      zjh_title.textContent = zjh_item.title;

      const zjh_desc = document.createElement('p');
      zjh_desc.textContent = zjh_item.description;

      const zjh_tag = document.createElement('span');
      zjh_tag.className = 'zjh_tag';
      zjh_tag.textContent = `${zjh_item.category} · ${new Date(zjh_item.create_time).toLocaleDateString('zh-CN')}`;

      zjh_body.append(zjh_title, zjh_desc, zjh_tag);
      zjh_card.append(zjh_img, zjh_body);
      zjh_grid.appendChild(zjh_card);
    });
  } catch (zjh_error) {
    console.error('[zjh] 图文数据加载失败:', zjh_error);
    zjh_total.textContent = '加载失败';
    zjh_grid.innerHTML = '<div class="zjh_empty">图文数据加载失败，请检查后端服务与接口地址。</div>';
  }
});
