/*
姓名：zjh | 学号：904 |
时间：2026-11-23 | 大模型：CodeBuddy (Tencent Hunyuan Hy)
*/
const path = require('path');
const { zjh_call_llm } = require('../services/zjh_llm_service');

const zjh_mime_map = {
  '.png': 'image/png', '.jpg': 'image/jpeg', '.jpeg': 'image/jpeg',
  '.webp': 'image/webp', '.gif': 'image/gif', '.bmp': 'image/bmp'
};

// 上传图片 → 转 data URL → 视觉模型 → 返回图片描述
async function zjh_vision_describe(zjh_req, zjh_res) {
  if (!zjh_req.file) {
    return zjh_res.status(400).json({ code: 400, msg: '请选择要识别的图片', data: null });
  }
  const zjh_ext = path.extname(zjh_req.file.originalname).toLowerCase();
  const zjh_mime = zjh_mime_map[zjh_ext] || 'image/png';
  const zjh_data_url = `data:${zjh_mime};base64,${zjh_req.file.buffer.toString('base64')}`;
  const zjh_messages = [{
    role: 'user',
    content: [
      { type: 'text', text: '请用中文详细描述这张图片的内容，包括主体、场景、颜色和文字（如有）。不超过 200 字。' },
      { type: 'image_url', image_url: { url: zjh_data_url } }
    ]
  }];
  const zjh_model = process.env.VISION_MODEL || 'Qwen/Qwen3-VL-8B-Instruct';

  console.log(`[vision] 收到图片 ${zjh_req.file.originalname}，大小 ${zjh_req.file.size} 字节，模型 ${zjh_model}`);
  const zjh_result = await zjh_call_llm({
    zjh_provider: 'siliconflow',
    zjh_model,
    zjh_messages,
    zjh_temperature: 0.2,
    zjh_max_tokens: 512
  });

  if (!zjh_result.ok) {
    let zjh_msg = zjh_result.msg;
    if (zjh_result.status === 400) {
      zjh_msg += '（注意：Qwen3-VL 模型要求图片宽和高都大于 28 像素，请换一张更大的图片）';
    }
    return zjh_res.status(zjh_result.status).json({ code: zjh_result.status, msg: zjh_msg, data: null });
  }
  return zjh_res.json({
    code: 0,
    msg: 'ok',
    data: {
      description: zjh_result.data.reply,
      filename: zjh_req.file.originalname,
      model: zjh_result.data.model,
      usage: zjh_result.data.usage
    }
  });
}

module.exports = { zjh_vision_describe };
