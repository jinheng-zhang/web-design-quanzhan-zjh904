/*
姓名：zjh | 学号：904 |
时间：2026-11-19 | 大模型：CodeBuddy (Tencent Hunyuan Hy)
*/
const express = require('express');
const zjh_router = express.Router();

const { zjh_health } = require('../controllers/zjh_health_controller');
const { zjh_db_test } = require('../controllers/zjh_db_controller');
const { zjh_get_news } = require('../controllers/zjh_news_controller');
const { zjh_get_gallery } = require('../controllers/zjh_gallery_controller');

zjh_router.get('/health', zjh_health);
zjh_router.post('/db-test', zjh_db_test);
zjh_router.get('/news', zjh_get_news);
zjh_router.get('/gallery', zjh_get_gallery);

module.exports = zjh_router;
