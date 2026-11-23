/*
姓名：zjh | 学号：904 |
时间：2026-11-23 | 大模型：CodeBuddy (Tencent Hunyuan Hy)
*/
const path = require('path');
const zjh_pool = require('../config/zjh_db');
const {
  zjh_parse_document, zjh_split_text, zjh_extract_keywords, zjh_search_chunks, zjh_build_context
} = require('../services/zjh_kb_service');
const { zjh_call_llm } = require('../services/zjh_llm_service');

// 上传文件 → 解析 → 切块 → 入库
async function zjh_kb_upload(zjh_req, zjh_res) {
  if (!zjh_req.file) {
    return zjh_res.status(400).json({ code: 400, msg: '请选择要上传的知识库文件', data: null });
  }
  const zjh_ext = path.extname(zjh_req.file.originalname).toLowerCase();
  try {
    const zjh_text = await zjh_parse_document(zjh_req.file.buffer, zjh_ext, zjh_req.file.originalname);
    if (!zjh_text || zjh_text.trim().length < 10) {
      return zjh_res.status(400).json({ code: 400, msg: '文件解析后没有可用文本，请确认文件不是扫描件或空文档', data: null });
    }
    const zjh_chunks = zjh_split_text(zjh_text, 600);
    if (zjh_chunks.length === 0) {
      return zjh_res.status(400).json({ code: 400, msg: '文本切块失败', data: null });
    }

    const zjh_conn = await zjh_pool.getConnection();
    try {
      await zjh_conn.beginTransaction();
      const [zjh_doc] = await zjh_conn.query(
        `INSERT INTO zjh_kb_document (zjh_filename, zjh_file_type, zjh_file_size, zjh_chunk_count, zjh_description, zjh_status)
         VALUES (?, ?, ?, ?, ?, 1)`,
        [zjh_req.file.originalname, zjh_ext.slice(1), zjh_req.file.size, zjh_chunks.length, (zjh_req.body.zjh_description || '').slice(0, 300)]
      );
      const zjh_doc_id = zjh_doc.insertId;
      for (let zjh_i = 0; zjh_i < zjh_chunks.length; zjh_i += 1) {
        await zjh_conn.query(
          `INSERT INTO zjh_kb_chunk (zjh_document_id, zjh_chunk_index, zjh_content, zjh_keyword)
           VALUES (?, ?, ?, ?)`,
          [zjh_doc_id, zjh_i, zjh_chunks[zjh_i], zjh_extract_keywords(zjh_chunks[zjh_i])]
        );
      }
      await zjh_conn.commit();
      console.log(`[kb] 上传成功 ${zjh_req.file.originalname}，切出 ${zjh_chunks.length} 个片段`);
      return zjh_res.json({
        code: 0,
        msg: '上传并解析成功',
        data: { id: zjh_doc_id, filename: zjh_req.file.originalname, chunkCount: zjh_chunks.length, textLength: zjh_text.length }
      });
    } catch (zjh_error) {
      await zjh_conn.rollback();
      throw zjh_error;
    } finally {
      zjh_conn.release();
    }
  } catch (zjh_error) {
    console.error('[kb] 上传失败:', zjh_error.message);
    return zjh_res.status(500).json({ code: 500, msg: '知识库文件上传失败：' + zjh_error.message, data: null });
  }
}

async function zjh_kb_list(_zjh_req, zjh_res) {
  try {
    const [zjh_rows] = await zjh_pool.query(
      `SELECT id, zjh_filename, zjh_file_type, zjh_file_size, zjh_chunk_count, zjh_description, zjh_upload_time
       FROM zjh_kb_document WHERE zjh_status = 1 ORDER BY id ASC`
    );
    return zjh_res.json({ code: 0, msg: 'ok', data: { list: zjh_rows, total: zjh_rows.length } });
  } catch (zjh_error) {
    console.error('[kb] 列表查询失败:', zjh_error.message);
    return zjh_res.status(500).json({ code: 500, msg: '知识库列表查询失败', data: null });
  }
}

async function zjh_kb_delete(zjh_req, zjh_res) {
  const zjh_id = parseInt(zjh_req.params.zjh_id, 10);
  if (!Number.isInteger(zjh_id)) {
    return zjh_res.status(400).json({ code: 400, msg: '文档 id 无效', data: null });
  }
  const zjh_conn = await zjh_pool.getConnection();
  try {
    await zjh_conn.beginTransaction();
    await zjh_conn.query('DELETE FROM zjh_kb_chunk WHERE zjh_document_id = ?', [zjh_id]);
    const [zjh_result] = await zjh_conn.query('DELETE FROM zjh_kb_document WHERE id = ?', [zjh_id]);
    await zjh_conn.commit();
    if (zjh_result.affectedRows === 0) {
      return zjh_res.status(404).json({ code: 404, msg: '未找到该文档', data: null });
    }
    return zjh_res.json({ code: 0, msg: '删除成功', data: { id: zjh_id } });
  } catch (zjh_error) {
    await zjh_conn.rollback();
    console.error('[kb] 删除失败:', zjh_error.message);
    return zjh_res.status(500).json({ code: 500, msg: '删除失败：' + zjh_error.message, data: null });
  } finally {
    zjh_conn.release();
  }
}

// 基于知识库的问答：检索片段 → 拼进 system → 调用大模型
async function zjh_kb_ask(zjh_req, zjh_res) {
  const zjh_question = String((zjh_req.body && zjh_req.body.zjh_question) || '').trim();
  if (!zjh_question) {
    return zjh_res.status(400).json({ code: 400, msg: '请输入问题', data: null });
  }
  try {
    const zjh_chunks = await zjh_search_chunks(zjh_question, 3);
    if (zjh_chunks.length === 0) {
      return zjh_res.status(404).json({ code: 404, msg: '知识库为空，请先上传文档', data: null });
    }
    const zjh_context = zjh_build_context(zjh_chunks);
    const zjh_system = [
      '你是基于知识库的问答助手。必须只根据下面提供的【资料】回答问题。',
      '如果资料中没有答案，直接回答"抱歉，知识库中没有相关信息"，不要编造。',
      '回答使用中文，尽量简洁，并在结尾用一句话说明依据的是哪份资料。',
      '',
      zjh_context
    ].join('\n');
    const zjh_messages = [
      { role: 'system', content: zjh_system },
      { role: 'user', content: zjh_question }
    ];
    const zjh_provider_name = (zjh_req.body && zjh_req.body.zjh_provider) === 'qiniu' ? 'qiniu' : 'siliconflow';
    const zjh_model = zjh_provider_name === 'qiniu'
      ? (process.env.QINIU_MODEL || 'qiniu/conatus-free')
      : (process.env.SILICONFLOW_MODEL || 'deepseek-ai/DeepSeek-V4-Flash');

    console.log('[kb] 检索到的资料片段:', zjh_chunks.map((zjh_item) => ({
      filename: zjh_item.zjh_filename, chunkIndex: zjh_item.zjh_chunk_index, score: zjh_item.zjh_score
    })));

    const zjh_result = await zjh_call_llm({
      zjh_provider: zjh_provider_name,
      zjh_model,
      zjh_messages,
      zjh_temperature: 0.2,
      zjh_max_tokens: 900
    });
    if (!zjh_result.ok) {
      return zjh_res.status(zjh_result.status).json({ code: zjh_result.status, msg: zjh_result.msg, data: null });
    }
    return zjh_res.json({
      code: 0,
      msg: 'ok',
      data: {
        answer: zjh_result.data.reply,
        sources: zjh_chunks.map((zjh_item) => ({
          filename: zjh_item.zjh_filename,
          chunkIndex: zjh_item.zjh_chunk_index,
          score: zjh_item.zjh_score,
          preview: zjh_item.zjh_content.slice(0, 80)
        })),
        provider: zjh_result.data.provider,
        model: zjh_result.data.model
      }
    });
  } catch (zjh_error) {
    console.error('[kb] 问答失败:', zjh_error.message);
    return zjh_res.status(500).json({ code: 500, msg: '知识库问答失败：' + zjh_error.message, data: null });
  }
}

module.exports = { zjh_kb_upload, zjh_kb_list, zjh_kb_delete, zjh_kb_ask };
