-- 姓名：zjh | 学号：904 | 时间：2026-11-23 | 大模型：CodeBuddy (Tencent Hunyuan Hy)
-- 知识库 RAG 初始化 SQL：2 个知识库文件 + 6 条内置知识条目，共 8 文档 8 片段

CREATE TABLE IF NOT EXISTS zjh_kb_document (
  id INT AUTO_INCREMENT PRIMARY KEY,
  zjh_filename VARCHAR(255) NOT NULL,
  zjh_file_type VARCHAR(20) NOT NULL,
  zjh_file_size INT NOT NULL DEFAULT 0,
  zjh_chunk_count INT NOT NULL DEFAULT 0,
  zjh_description VARCHAR(300) DEFAULT '',
  zjh_upload_time DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  zjh_status TINYINT NOT NULL DEFAULT 1
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS zjh_kb_chunk (
  id INT AUTO_INCREMENT PRIMARY KEY,
  zjh_document_id INT NOT NULL,
  zjh_chunk_index INT NOT NULL,
  zjh_content TEXT NOT NULL,
  zjh_keyword VARCHAR(500) DEFAULT '',
  zjh_create_time DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  KEY zjh_idx_doc (zjh_document_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

DELETE FROM zjh_kb_chunk;
DELETE FROM zjh_kb_document;

INSERT INTO zjh_kb_document (id, zjh_filename, zjh_file_type, zjh_file_size, zjh_chunk_count, zjh_description, zjh_status) VALUES
(1, 'zjh_service_manual.txt', 'txt', 1800, 1, '中华美食街服务手册：营业时间、招牌菜、配送范围、售后规则', 1),
(2, 'zjh_course_faq.txt', 'txt', 1600, 1, '高级网页设计课程常见问题：项目规则、命名注释、启动访问、接口错误码', 1),
(3, 'zjh_delivery_policy.txt', 'txt', 420, 1, '内置知识：配送距离、起送金额与预计送达时间', 1),
(4, 'zjh_menu_items.txt', 'txt', 380, 1, '内置知识：招牌菜名称、价格与口味备注', 1),
(5, 'zjh_return_policy.txt', 'txt', 460, 1, '内置知识：错发漏发退款、口味原因不退、发票申请', 1),
(6, 'zjh_port_rule.txt', 'txt', 350, 1, '内置知识：8904 端口来源与浏览器访问方式', 1),
(7, 'zjh_naming_rule.txt', 'txt', 390, 1, '内置知识：zjh_ 前缀命名与文件头注释要求', 1),
(8, 'zjh_error_codes.txt', 'txt', 410, 1, '内置知识：401、402、404、429、504 大模型错误码含义', 1);

INSERT INTO zjh_kb_chunk (id, zjh_document_id, zjh_chunk_index, zjh_content, zjh_keyword) VALUES
(1, 1, 0, '中华美食街营业时间为每日10:00至22:00，周末与法定节假日照常营业，后厨最后接单时间21:30。每月第一个周一上午10:00至12:00设备维护，暂停堂食与配送。招牌菜有糖醋鲤鱼38元、麻婆豆腐22元、小笼包18元一笼8只、宫保鸡丁32元。配送范围门店周边3公里内，满30元起送，配送费3元；3至5公里满60元起送，配送费6元；超过5公里不配送。雨天配送延长约10分钟。客服在线时间9:00至22:00，门店地址美食街A区18号，电话400-888-1024。', '营业时间,招牌菜,配送范围,糖醋鲤鱼,麻婆豆腐,小笼包,宫保鸡丁,客服,地址,电话'),
(2, 2, 0, '高级网页设计课程项目前端位于frontend目录，使用原生HTML、CSS、JavaScript，禁止第三方框架与CDN。后端位于backend目录，使用Node.js与Express，RESTful加MVC风格，接口统一以/api为前缀，端口固定为学号后三位8904，静态资源由express.static托管frontend。数据库使用MySQL，密码只写入backend/.env。CSS类名、JS变量函数名、数据库表名与字段名一律以zjh_开头。每个文件头部要有姓名、学号、时间、大模型名称注释。统一JSON格式为code、msg、data。接口记录写入zjh_interface.md，数据库记录写入zjh_database.md，提示词记录写入zjh_prompt.md，均为追加写入。', '前端,后端,端口,8904,命名规范,注释,记录文件,JSON,Express,MySQL'),
(3, 3, 0, '配送细则：门店周边3公里内可配送，满30元起送，配送费3元。3公里至5公里区域需满60元起送，配送费6元。超过5公里暂不提供配送，建议到店品尝。下单后预计30至45分钟送达，高峰期11:30至13:00与17:30至19:30可能延长至60分钟。雨天或恶劣天气额外增加约10分钟。', '配送范围,起送金额,配送费,送达时间,高峰期,雨天'),
(4, 4, 0, '招牌菜单：糖醋鲤鱼38元，当日鲜活鲤鱼制作，外酥里嫩，销量第一。麻婆豆腐22元，使用四川汉源花椒，可备注微辣、中辣、特辣。小笼包18元一笼共8只，现包现蒸汤汁丰富。宫保鸡丁32元，鸡腿肉配花生米，酸甜微辣。回复菜单可查看完整菜单。', '招牌菜,菜单,糖醋鲤鱼,麻婆豆腐,小笼包,宫保鸡丁,价格'),
(5, 5, 0, '售后与退换货规则：菜品送达后发现漏发、错发或明显变质，请在30分钟内联系客服并提供订单号与照片，核实后可全额退款或补发。因个人口味原因例如太辣太咸不接受无理由退换。线上订单取消需在商家接单前操作，接单后无法取消。发票可在订单完成后7天内申请，需提供订单号与抬头。', '退换货,退款,漏发,错发,发票,取消订单,售后'),
(6, 6, 0, '项目启动与访问规则：在backend目录执行npm run dev，或双击项目根目录start.bat。启动成功后浏览器访问http://localhost:8904/。不要直接双击frontend目录下的HTML文件，否则/api请求会失败。修改backend/.env后必须重启服务才能生效。端口8904来自学号904的后三位。若端口被占用可用netstat -ano查找占用进程。', '启动,访问,start.bat,8904,localhost,重启,netstat'),
(7, 7, 0, '命名与注释规范：CSS类名、JavaScript变量名、JavaScript函数名、数据库表名以及字段相关命名一律以zjh_开头。每个文件头部包含统一注释块，内容为姓名zjh、学号904、时间yyyy-mm-dd、大模型名称CodeBuddy。所有记录文件一律追加写入，禁止覆盖已有内容。统一JSON响应格式为code为0成功、非0失败，msg提示信息，data数据对象。', 'zjh_前缀,命名规范,文件头注释,追加写入,JSON响应'),
(8, 8, 0, '大模型接口常见错误码：401表示API Key错误、少了Bearer或复制时带了空格；402表示余额不足或未领取免费额度；404表示模型名写错或baseURL少了/v1；429表示请求太频繁触发限流；504表示模型响应超时。排错顺序为先curl测Key，再测自己的后端接口，最后看前端。API Key只能放在后端.env中，不能出现在前端代码与Git里。', '错误码,401,402,404,429,504,Key安全,排错');
