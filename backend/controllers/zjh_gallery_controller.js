/*
姓名：zjh | 学号：904 |
时间：2026-11-19 | 大模型：CodeBuddy (Tencent Hunyuan Hy)
*/
const zjh_pool = require('../config/zjh_db');

async function zjh_get_gallery(_zjh_req, zjh_res) {
  try {
    const [zjh_rows] = await zjh_pool.query(
      'SELECT id, title, description, img_url, category, create_time FROM zjh_gallery ORDER BY create_time DESC'
    );
    zjh_res.json({ code: 0, msg: 'ok', data: { list: zjh_rows, total: zjh_rows.length } });
  } catch (zjh_error) {
    console.error('[gallery] 查询失败:', zjh_error.message);
    zjh_res.status(500).json({ code: 500, msg: '图文数据查询失败：' + zjh_error.message, data: null });
  }
}

module.exports = { zjh_get_gallery };
