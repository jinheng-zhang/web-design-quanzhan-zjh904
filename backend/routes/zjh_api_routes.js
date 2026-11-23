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
const { zjh_chat } = require('../controllers/zjh_chat_controller');
const { zjh_upload_kb, zjh_upload_image, zjh_upload_audio } = require('../config/zjh_upload_config');
const { zjh_kb_upload, zjh_kb_list, zjh_kb_delete, zjh_kb_ask } = require('../controllers/zjh_kb_controller');
const { zjh_vision_describe } = require('../controllers/zjh_vision_controller');
const { zjh_asr_transcribe } = require('../controllers/zjh_asr_controller');

function zjh_upload_middleware(zjh_uploader) {
  return function (zjh_req, zjh_res, zjh_next) {
    zjh_uploader(zjh_req, zjh_res, (zjh_error) => {
      if (zjh_error) {
        return zjh_res.status(400).json({ code: 400, msg: zjh_error.message, data: null });
      }
      zjh_next();
    });
  };
}

zjh_router.get('/health', zjh_health);
zjh_router.post('/db-test', zjh_db_test);
zjh_router.get('/news', zjh_get_news);
zjh_router.get('/gallery', zjh_get_gallery);
zjh_router.post('/chat', zjh_chat);
zjh_router.post('/kb/upload', zjh_upload_middleware(zjh_upload_kb), zjh_kb_upload);
zjh_router.get('/kb/list', zjh_kb_list);
zjh_router.delete('/kb/:zjh_id', zjh_kb_delete);
zjh_router.post('/kb/ask', zjh_kb_ask);
zjh_router.post('/vision', zjh_upload_middleware(zjh_upload_image), zjh_vision_describe);
zjh_router.post('/asr', zjh_upload_middleware(zjh_upload_audio), zjh_asr_transcribe);

module.exports = zjh_router;
