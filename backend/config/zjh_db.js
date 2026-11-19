/*
姓名：zjh | 学号：904 |
时间：2026-11-19 | 大模型：CodeBuddy (Tencent Hunyuan Hy)
*/
const mysql = require('mysql2/promise');
require('dotenv').config();

const zjh_pool = mysql.createPool({
  host: process.env.DB_HOST || '127.0.0.1',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'zjh_fullstack_db',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

module.exports = zjh_pool;
