/*
姓名：zjh | 学号：904 |
时间：2026-11-19 | 大模型：CodeBuddy (Tencent Hunyuan Hy)
*/
const mysql = require('mysql2/promise');
require('dotenv').config();

async function zjh_db_test(zjh_req, zjh_res) {
  const zjh_username = (zjh_req.body && zjh_req.body.username) || 'root';
  const zjh_password = zjh_req.body && zjh_req.body.password;

  if (zjh_username !== (process.env.DB_USER || 'root')) {
    console.error('[db-test] 用户名不匹配:', zjh_username);
    return zjh_res.status(401).json({
      code: 401,
      msg: `Access denied for user '${zjh_username}'`,
      data: null
    });
  }
  if (zjh_password !== undefined && zjh_password !== process.env.DB_PASSWORD) {
    console.error('[db-test] 密码校验失败');
    return zjh_res.status(401).json({
      code: 401,
      msg: `Access denied for user '${zjh_username}' (using password: YES)`,
      data: null
    });
  }

  let zjh_connection;
  try {
    zjh_connection = await mysql.createConnection({
      host: process.env.DB_HOST || '127.0.0.1',
      user: process.env.DB_USER || 'root',
      password: process.env.DB_PASSWORD || ''
    });
    const [zjh_rows] = await zjh_connection.query('SELECT VERSION() AS version');
    zjh_res.json({
      code: 0,
      msg: '数据库连接成功',
      data: { version: zjh_rows[0].version, host: process.env.DB_HOST || '127.0.0.1' }
    });
  } catch (zjh_error) {
    console.error('[db-test] 数据库连接失败:', zjh_error.message);
    zjh_res.status(500).json({
      code: 500,
      msg: '数据库连接失败：' + zjh_error.message,
      data: null
    });
  } finally {
    if (zjh_connection) await zjh_connection.end().catch(() => {});
  }
}

module.exports = { zjh_db_test };
