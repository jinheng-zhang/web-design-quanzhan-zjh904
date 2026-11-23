<!--
姓名：zjh | 学号：904 |
时间：2026-11-19 | 大模型：CodeBuddy (Tencent Hunyuan Hy)
-->

# 数据库重建记录（追加写入，禁止覆盖）

说明：本文件按执行顺序记录全部建库、建表、插入数据的 SQL，仅凭本文件即可在新机器上重建数据库。

```sql
-- 2026-11-19 创建数据库
CREATE DATABASE IF NOT EXISTS zjh_fullstack_db DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE zjh_fullstack_db;
```

```sql
-- 2026-11-19 创建新闻表并插入 8 条测试数据
CREATE TABLE IF NOT EXISTS zjh_news (
  id INT UNSIGNED NOT NULL AUTO_INCREMENT,
  title VARCHAR(200) NOT NULL COMMENT '新闻标题',
  summary VARCHAR(500) NOT NULL COMMENT '新闻摘要',
  content TEXT NOT NULL COMMENT '新闻正文',
  source VARCHAR(100) NOT NULL COMMENT '新闻来源',
  publish_time DATETIME NOT NULL COMMENT '发布时间',
  cover_img VARCHAR(500) NOT NULL DEFAULT '' COMMENT '封面图地址',
  PRIMARY KEY (id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='科技新闻表';

INSERT INTO zjh_news (title, summary, content, source, publish_time, cover_img) VALUES
('800G 光模块产线正式投产', '新一代高速光模块产线在华东投产，单模块速率达到 800G，可支撑 AI 集群互联需求。', '产线采用自动化耦合与自动化测试工艺，良率较上一代提升 12%，预计年内产能逐步爬坡。', '科技前沿网', '2026-11-18 09:30:00', 'https://picsum.photos/seed/zjhnews1/640/360'),
('固态电池能量密度突破 400Wh/kg', '研究团队公布新型固态电池样品，能量密度突破 400Wh/kg，循环寿命超过 1200 次。', '该样品采用硫化物电解质与复合负极，在安全性测试中通过针刺与热箱实验，下一步推进装车验证。', '新能源观察', '2026-11-17 14:15:00', 'https://picsum.photos/seed/zjhnews2/640/360'),
('开源操作系统发布 6.0 版本', '主流开源操作系统发布 6.0 版本，重点优化调度器与文件系统，提升多核处理器利用率。', '新版本引入统一内存管理框架，并改进对 RISC-V 架构的支持，开发者可获取源码与镜像。', '开源社区日报', '2026-11-16 10:00:00', 'https://picsum.photos/seed/zjhnews3/640/360'),
('AI 辅助诊断系统完成临床验证', '医疗 AI 团队宣布辅助诊断系统完成多中心临床验证，影像识别准确率达到 94.6%。', '系统在肺结节、眼底病变等场景中完成超过 10 万例样本的回顾性测试，将进入试点应用阶段。', '数字医疗报', '2026-11-15 08:45:00', 'https://picsum.photos/seed/zjhnews4/640/360'),
('低轨卫星互联网完成组网测试', '低轨卫星互联网完成新一轮组网测试，星间激光链路实现稳定数据传输。', '本次测试验证了多星协同调度与地面终端切换能力，单星下行带宽达到 1.2Gbps。', '通信世界', '2026-11-14 16:20:00', 'https://picsum.photos/seed/zjhnews5/640/360'),
('智能机器人实现多任务协同作业', '新一代服务机器人在仓储场景实现多任务协同，可自主完成分拣、搬运与盘点。', '机器人搭载多模态感知模块，任务调度延迟降低至 80 毫秒，集群规模可扩展至 200 台。', '智能制造网', '2026-11-13 11:05:00', 'https://picsum.photos/seed/zjhnews6/640/360'),
('量子纠错编码取得新进展', '量子计算团队发布新型纠错编码方案，逻辑比特错误率较此前方案下降一个数量级。', '研究采用表面码与实时解码结合的方式，在超导量子处理器上完成验证，成果已提交学术期刊。', '科学通报', '2026-11-12 15:40:00', 'https://picsum.photos/seed/zjhnews7/640/360'),
('液冷数据中心规模化应用提速', '多家数据中心运营商开始规模部署液冷方案，单机柜功率密度提升至 60kW。', '冷板式液冷与浸没式液冷两条路线并行推进，全年相关设备出货量同比增长 65%。', '数据中心观察', '2026-11-11 09:10:00', 'https://picsum.photos/seed/zjhnews8/640/360');

-- 2026-11-19 创建图文表并插入 8 条测试数据
CREATE TABLE IF NOT EXISTS zjh_gallery (
  id INT UNSIGNED NOT NULL AUTO_INCREMENT,
  title VARCHAR(200) NOT NULL COMMENT '图文标题',
  description VARCHAR(500) NOT NULL COMMENT '图文描述',
  img_url VARCHAR(500) NOT NULL COMMENT '图片地址',
  category VARCHAR(100) NOT NULL COMMENT '分类',
  create_time DATETIME NOT NULL COMMENT '创建时间',
  PRIMARY KEY (id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='图文表';

INSERT INTO zjh_gallery (title, description, img_url, category, create_time) VALUES
('晨雾中的山峦', '清晨的薄雾环绕山腰，光线从云层缝隙洒向山谷。', 'https://picsum.photos/seed/zjhgallery1/640/420', '自然风光', '2026-11-18 08:20:00'),
('城市夜色', '霓虹灯映照下的城市街道，车流拉出长长的光轨。', 'https://picsum.photos/seed/zjhgallery2/640/420', '城市影像', '2026-11-17 20:35:00'),
('桌面工作流', '整洁的桌面与双显示器，记录高效工作流的一天。', 'https://picsum.photos/seed/zjhgallery3/640/420', '科技生活', '2026-11-16 13:10:00'),
('海岸线的傍晚', '落日把海面染成金色，浪花轻轻拍打礁石。', 'https://picsum.photos/seed/zjhgallery4/640/420', '自然风光', '2026-11-15 18:05:00'),
('街角咖啡馆', '午后阳光透过玻璃窗，照在木质吧台和咖啡杯上。', 'https://picsum.photos/seed/zjhgallery5/640/420', '城市影像', '2026-11-14 14:45:00'),
('森林小径', '雨后湿润的林间小路，两侧是茂密的绿色植被。', 'https://picsum.photos/seed/zjhgallery6/640/420', '自然风光', '2026-11-13 10:30:00'),
('机械键盘特写', '复古配色的机械键盘，键帽纹理在灯光下清晰可见。', 'https://picsum.photos/seed/zjhgallery7/640/420', '科技生活', '2026-11-12 16:15:00'),
('雪山与湖泊', '雪峰倒映在平静的湖面上，构成对称的高原风景。', 'https://picsum.photos/seed/zjhgallery8/640/420', '自然风光', '2026-11-11 07:50:00');
```

<!-- 后续 SQL 记录追加于此 -->


## 2026-11-23 知识库 RAG 建表与初始数据（追加）



```sql
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
```
