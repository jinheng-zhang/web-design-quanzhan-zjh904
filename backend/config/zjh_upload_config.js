/*
姓名：zjh | 学号：904 |
时间：2026-11-23 | 大模型：CodeBuddy (Tencent Hunyuan Hy)
*/
const path = require('path');
const multer = require('multer');

const zjh_doc_exts = ['.txt', '.md', '.doc', '.docx', '.ppt', '.pptx', '.pdf'];
const zjh_image_exts = ['.png', '.jpg', '.jpeg', '.webp', '.gif', '.bmp'];
const zjh_audio_exts = ['.wav', '.mp3', '.ogg', '.m4a', '.webm', '.flac', '.aac'];

function zjh_make_upload(zjh_exts, zjh_limit_mb, zjh_field) {
  const zjh_uploader = multer({
    storage: multer.memoryStorage(),
    limits: { fileSize: zjh_limit_mb * 1024 * 1024 },
    fileFilter(zjh_req, zjh_file, zjh_cb) {
      const zjh_ext = path.extname(zjh_file.originalname).toLowerCase();
      if (zjh_exts.includes(zjh_ext)) return zjh_cb(null, true);
      zjh_cb(new Error('不支持的文件类型 ' + zjh_ext + '，仅允许：' + zjh_exts.join('、')));
    }
  });
  return zjh_uploader.single(zjh_field);
}

module.exports = {
  zjh_upload_kb: zjh_make_upload(zjh_doc_exts, 10, 'file'),
  zjh_upload_image: zjh_make_upload(zjh_image_exts, 8, 'image'),
  zjh_upload_audio: zjh_make_upload(zjh_audio_exts, 12, 'audio'),
  zjh_doc_exts,
  zjh_image_exts,
  zjh_audio_exts
};
