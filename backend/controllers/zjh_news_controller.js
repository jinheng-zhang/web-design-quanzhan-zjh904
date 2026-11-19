/*
姓名：zjh | 学号：904 |
时间：2026-11-19 | 大模型：CodeBuddy (Tencent Hunyuan Hy)
*/
const zjh_pool = require('../config/zjh_db');

async function zjh_get_news(_zjh_req, zjh_res) {
  try {
    const [zjh_rows] = await zjh_pool.query(
      'SELECT id, title, summary, content, source, publish_time, cover_img FROM zjh_news ORDER BY publish_time DESC'
    );
    zjh_res.json({ code: 0, msg: 'ok', data: { list: zjh_rows, total: zjh_rows.length } });
  } catch (zjh_error) {
    console.error('[news] 查询失败:', zjh_error.message);
    zjh_res.status(500).json({ code: 500, msg: '新闻数据查询失败：' + zjh_error.message, data: null });
  }
}

module.exports = { zjh_get_news };
