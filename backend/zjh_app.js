/*
姓名：zjh | 学号：904 |
时间：2026-11-19 | 大模型：CodeBuddy (Tencent Hunyuan Hy)
*/
const express = require('express');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

const zjh_app = express();
const zjh_port = process.env.PORT || 8904;

zjh_app.use(cors());
zjh_app.use(express.json());
zjh_app.use(express.urlencoded({ extended: true }));
zjh_app.use('/api', require('./routes/zjh_api_routes'));
zjh_app.use(express.static(path.join(__dirname, '..', 'frontend')));

zjh_app.use((zjh_error, _zjh_req, zjh_res, _zjh_next) => {
  console.error('[server] 未处理异常:', zjh_error);
  zjh_res.status(500).json({ code: 500, msg: '服务器内部错误', data: { error: zjh_error.message } });
});

zjh_app.listen(zjh_port, () => {
  console.log(`Server running at http://localhost:${zjh_port}`);
});
