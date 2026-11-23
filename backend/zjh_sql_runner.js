/*
姓名：zjh | 学号：904 |
时间：2026-11-19 | 大模型：CodeBuddy (Tencent Hunyuan Hy)
*/
const fs = require('fs');
const path = require('path');
const mysql = require('mysql2/promise');
require('dotenv').config();

async function zjh_run_sql() {
  const zjh_sql = fs.readFileSync(path.join(__dirname, 'zjh_init.sql'), 'utf8').replace(/^\uFEFF/, '');
  const zjh_conn = await mysql.createConnection({
    host: process.env.DB_HOST || '127.0.0.1',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    multipleStatements: true
  });
  try {
    await zjh_conn.query(zjh_sql);
    const [zjh_rows] = await zjh_conn.query(
      "SELECT 'zjh_news' AS zjh_table, COUNT(*) AS zjh_count FROM zjh_news UNION ALL SELECT 'zjh_gallery', COUNT(*) FROM zjh_gallery"
    );
    console.log('数据库初始化完成:', zjh_rows);
  } finally {
    await zjh_conn.end();
  }
}

zjh_run_sql().catch((zjh_error) => {
  console.error('数据库初始化失败:', zjh_error.message);
  process.exitCode = 1;
});
