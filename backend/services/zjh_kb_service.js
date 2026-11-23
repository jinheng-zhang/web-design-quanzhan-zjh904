/*
姓名：zjh | 学号：904 |
时间：2026-11-23 | 大模型：CodeBuddy (Tencent Hunyuan Hy)
*/
const fs = require('fs');
const os = require('os');
const path = require('path');
const zjh_pool = require('../config/zjh_db');

// 解析 doc / docx / ppt / pptx / pdf / txt，统一返回纯文本
async function zjh_parse_document(zjh_buffer, zjh_ext, zjh_filename) {
  if (['.txt', '.md'].includes(zjh_ext)) {
    return zjh_buffer.toString('utf8');
  }
  if (zjh_ext === '.pdf') {
    const zjh_pdf = require('pdf-parse');
    const zjh_result = await zjh_pdf(zjh_buffer);
    return zjh_result.text || '';
  }
  if (['.doc', '.docx', '.ppt', '.pptx'].includes(zjh_ext)) {
    const zjh_office = require('officeparser');
    const zjh_tmp = path.join(os.tmpdir(), 'zjh_kb_' + Date.now() + '_' + Math.random().toString(36).slice(2) + zjh_ext);
    fs.writeFileSync(zjh_tmp, zjh_buffer);
    try {
      const zjh_text = await zjh_office.parseOfficeAsync(zjh_tmp);
      return typeof zjh_text === 'string' ? zjh_text : String(zjh_text || '');
    } finally {
      if (fs.existsSync(zjh_tmp)) fs.unlinkSync(zjh_tmp);
    }
  }
  throw new Error(`文件 ${zjh_filename} 的类型 ${zjh_ext} 暂不支持解析`);
}

// 按段落切块，尽量不切断句子；单块最大 zjh_size 字
function zjh_split_text(zjh_text, zjh_size) {
  const zjh_limit = zjh_size || 600;
  const zjh_clean = zjh_text.replace(/\r/g, '').replace(/[ \t]+/g, ' ').trim();
  if (!zjh_clean) return [];
  const zjh_lines = zjh_clean.split(/\n+/).filter((zjh_line) => zjh_line.trim());
  const zjh_chunks = [];
  let zjh_buffer = '';
  for (const zjh_line of zjh_lines) {
    let zjh_rest = zjh_line.trim();
    while (zjh_rest.length > zjh_limit) {
      if (zjh_buffer) {
        zjh_chunks.push(zjh_buffer.trim());
        zjh_buffer = '';
      }
      zjh_chunks.push(zjh_rest.slice(0, zjh_limit));
      zjh_rest = zjh_rest.slice(zjh_limit);
    }
    if (!zjh_rest) continue;
    if (zjh_buffer && zjh_buffer.length + zjh_rest.length + 1 > zjh_limit) {
      zjh_chunks.push(zjh_buffer.trim());
      zjh_buffer = zjh_rest;
    } else {
      zjh_buffer = zjh_buffer ? zjh_buffer + '\n' + zjh_rest : zjh_rest;
    }
  }
  if (zjh_buffer.trim()) zjh_chunks.push(zjh_buffer.trim());
  return zjh_chunks;
}

// 提取中文二元组作为关键词，供检索加权使用
function zjh_extract_keywords(zjh_text) {
  const zjh_freq = {};
  for (let zjh_i = 0; zjh_i < zjh_text.length - 1; zjh_i += 1) {
    const zjh_word = zjh_text.slice(zjh_i, zjh_i + 2);
    if (/^[\u4e00-\u9fa5]{2}$/.test(zjh_word)) {
      zjh_freq[zjh_word] = (zjh_freq[zjh_word] || 0) + 1;
    }
  }
  return Object.keys(zjh_freq)
    .sort((zjh_a, zjh_b) => zjh_freq[zjh_b] - zjh_freq[zjh_a])
    .slice(0, 24)
    .join(',');
}

// 检索：问题二元组与片段正文/关键词的重合度打分，文件名命中额外加权
function zjh_score_chunk(zjh_question, zjh_row) {
  const zjh_q = String(zjh_question || '').toLowerCase();
  let zjh_score = 0;
  for (let zjh_i = 0; zjh_i < zjh_q.length - 1; zjh_i += 1) {
    const zjh_word = zjh_q.slice(zjh_i, zjh_i + 2);
    if (!/^[\u4e00-\u9fa5a-z0-9]{2}$/.test(zjh_word)) continue;
    if (zjh_row.zjh_keyword && zjh_row.zjh_keyword.indexOf(zjh_word) !== -1) zjh_score += 3;
    if (zjh_row.zjh_content && zjh_row.zjh_content.toLowerCase().indexOf(zjh_word) !== -1) zjh_score += 1;
  }
  if (zjh_row.zjh_filename && zjh_row.zjh_filename.toLowerCase().indexOf(zjh_q) !== -1) zjh_score += 12;
  return zjh_score;
}

async function zjh_search_chunks(zjh_question, zjh_top_k) {
  const [zjh_rows] = await zjh_pool.query(
    `SELECT c.id, c.zjh_document_id, c.zjh_chunk_index, c.zjh_content, c.zjh_keyword, d.zjh_filename
     FROM zjh_kb_chunk c JOIN zjh_kb_document d ON c.zjh_document_id = d.id
     WHERE d.zjh_status = 1`
  );
  const zjh_scored = zjh_rows.map((zjh_row) => ({ ...zjh_row, zjh_score: zjh_score_chunk(zjh_question, zjh_row) }));
  zjh_scored.sort((zjh_a, zjh_b) => zjh_b.zjh_score - zjh_a.zjh_score);
  return zjh_scored.slice(0, zjh_top_k || 3);
}

function zjh_build_context(zjh_chunks) {
  return zjh_chunks.map((zjh_chunk, zjh_index) =>
    `【资料${zjh_index + 1}｜来源：${zjh_chunk.zjh_filename}｜片段${zjh_chunk.zjh_chunk_index + 1}】\n${zjh_chunk.zjh_content}`
  ).join('\n\n');
}

module.exports = {
  zjh_parse_document,
  zjh_split_text,
  zjh_extract_keywords,
  zjh_search_chunks,
  zjh_build_context
};
