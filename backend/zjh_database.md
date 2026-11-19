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

<!-- 后续 SQL 记录追加于此 -->
