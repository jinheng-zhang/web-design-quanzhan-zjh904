-- 姓名：zjh | 学号：904 | 时间：2026-11-19 | 大模型：CodeBuddy (Tencent Hunyuan Hy)
CREATE DATABASE IF NOT EXISTS zjh_fullstack_db DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE zjh_fullstack_db;

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
