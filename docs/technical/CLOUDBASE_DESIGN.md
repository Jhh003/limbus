# 腾讯云CloudBase 排行榜系统设计

## 🎯 设计原则
- **MVP优先**：第一版只实现基础排行榜（方案A）
- **接口完整**：所有数据库字段和API接口设计完整
- **分阶段实现**：不同功能模块用注释标记实现阶段
- **向后兼容**：新增功能不需要修改现有代码，只需补充

## 📊 数据库设计

### 集合名称及设计阶段

```
├── rankings          # MVP必需 ⭐
├── users             # 第二阶段（用户认证）
├── comments          # 第二阶段（社交互动）
├── stats             # 第二阶段（数据分析）
└── announcements     # 可选（系统公告）
```

---

## 1️⃣ Rankings 集合（核心，MVP必需）

### 字段设计
```javascript
{
  // 系统字段（自动生成）
  _id: "唯一ID",
  _createTime: 1707124200000,
  _updateTime: 1707124200000,

  // 核心数据（MVP必需）
  username: "玩家昵称",              // 当前MVP：匿名玩家或输入昵称
  sinner: "李箱",                    // 罪人名称
  sinnerId: 1,                       // 罪人ID
  persona: "W公司3级清扫人员",       // 人格名称
  floorLevel: 15,                    // 层数：5/10/15
  time: 7321,                        // 通关时间（秒）
  createDate: "2026-02-05",          // 通关日期
  submittedAt: 1707124200000,        // 提交时间戳

  // 可选内容（MVP可选）
  egoUsed: ["凶弹", "提灯"],        // 使用的EGO
  comment: "这局用了特殊技巧",      // 用户备注
  difficulty: 8,                     // 难度评分(1-10)
  screenshotUrl: "cos://...",       // 截图URL(可选)

  // 验证状态（防作弊，MVP需要）
  status: "verified",                // pending/verified/disputed/rejected
  antiCheatFlags: [],               // 防作弊标记
  verifiedAt: 1707124200000,        // 验证时间

  // 预留字段：用户认证（第二阶段）
  userId: null,                      // 用户ID（登录后关联）
  userLevel: 1,                      // 用户等级
  
  // 预留字段：互动数据（第二阶段）
  likeCount: 0,                      // 点赞数
  commentCount: 0,                   // 评论数
  views: 0,                          // 浏览数
  
  // 预留字段：版本管理（第二阶段）
  gameVersion: "1.5.0",              // 游戏版本
  clientVersion: "1.0.0"             // 客户端版本
}
```

### 索引设计
```
✓ 按时间排序：time (升序)
✓ 按日期筛选：floorLevel, createDate
✓ 按罪人筛选：sinner, sinnerId
✓ 按状态筛选：status
✓ 热门排序：likeCount, views (第二阶段)
```

### MVP实现范围
```
✅ 创建：username, sinner, persona, floorLevel, time, egoUsed, comment, difficulty
✅ 查询：列表、筛选、排序
✅ 防作弊：时间检查、重复检查、速率限制
❌ 用户认证：暂不实现，预留userId字段
❌ 互动：暂不实现，预留字段
❌ 截图上传：暂不实现，预留screenshotUrl字段
```

---

## 2️⃣ Users 集合（预留，第二阶段）

```javascript
{
  _id: "用户ID",
  username: "用户昵称",
  password: "密码hash",
  email: "邮箱",
  
  // 等级和成就
  level: 1,
  experience: 0,
  achievements: ["新手"],
  
  // 统计
  totalRecords: 0,
  verifiedRecords: 0,
  bestTime: Infinity,
  
  // 社交
  followers: [],
  following: [],
  followerCount: 0,
  
  // 状态
  isActive: true,
  isBanned: false,
  banUntil: null,
  
  // 时间
  createdAt: timestamp,
  lastActiveAt: timestamp
}
```

---

## 3️⃣ Comments 集合（预留，第二阶段）

```javascript
{
  _id: "评论ID",
  recordId: "关联的排行榜ID",
  userId: "评论者ID",
  username: "评论者昵称",
  content: "评论内容",
  
  // 互动
  likes: [],
  likeCount: 0,
  replies: [],
  
  // 状态
  isApproved: true,
  isDeleted: false,
  
  createdAt: timestamp
}
```

---

## 4️⃣ Stats 集合（预留，第二阶段）

```javascript
{
  _id: "统计ID",
  date: "2026-02-05",
  sinnerId: 1,
  sinnerName: "李箱",
  
  // 统计数据
  totalSubmissions: 567,
  avgTime: 7245,
  mostUsedPersona: { name: "...", count: 234 },
  
  // 更多统计...
}
```

---

## 🔌 API 接口设计

### 前端调用格式（统一）

```javascript
// 成功响应
{
  code: 200,
  message: "成功",
  data: { /* 业务数据 */ }
}

// 错误响应
{
  code: 400,
  message: "错误原因",
  data: null
}
```

---

### 排行榜相关 API（MVP实现）

#### 1. 提交排行榜记录
```javascript
POST /api/rankings/submit
请求体：{
  username: string,
  sinner: string,
  sinnerId: number,
  persona: string,
  floorLevel: number (5/10/15),
  time: number,
  egoUsed?: string[],
  comment?: string,
  difficulty?: number
}

响应：{
  code: 200,
  message: "提交成功",
  data: {
    recordId: "记录ID",
    status: "verified/pending",
    antiCheatWarnings: []  // 防作弊警告
  }
}

【第二阶段升级】
- 添加：Authorization header (JWT token)
- 自动关联userId
```

---

#### 2. 获取排行榜列表
```javascript
GET /api/rankings/list?
  page=1&
  limit=20&
  sinner=李箱&
  floorLevel=15&
  sortBy=time&
  status=verified

响应：{
  code: 200,
  data: {
    total: 1234,
    page: 1,
    limit: 20,
    records: [
      {
        _id: "...",
        username: "...",
        sinner: "...",
        time: 7321,
        createdAt: timestamp,
        likeCount: 0,           // 预留
        commentCount: 0         // 预留
      }
    ]
  }
}

【第二阶段升级】
- 添加排序：sortBy: "time|views|likes|date"
- 返回互动数据：likeCount, commentCount
```

---

#### 3. 获取单条记录详情
```javascript
GET /api/rankings/:recordId

响应：{
  code: 200,
  data: {
    _id: "...",
    username: "...",
    sinner: "...",
    persona: "...",
    time: 7321,
    egoUsed: [...],
    comment: "...",
    difficulty: 8,
    screenshotUrl: "",       // 预留
    likeCount: 0,            // 预留
    commentCount: 0,         // 预留
    createdAt: timestamp,
    user: {                  // 预留，第二阶段返回
      _id: "...",
      username: "...",
      level: 1
    }
  }
}
```

---

#### 4. 删除自己的记录（需认证）
```javascript
DELETE /api/rankings/:recordId
Headers: Authorization: Bearer <token>

响应：{
  code: 200,
  message: "删除成功"
}

【MVP阶段】
- 不需要认证，直接删除（记录提交者输入的username）
【第二阶段升级】
- 需要认证，检查是否是记录所有者
```

---

### 用户相关 API（第二阶段）

```javascript
// 预留接口，暂不实现
POST   /api/users/register
POST   /api/users/login
GET    /api/users/:userId/profile
PATCH  /api/users/:userId/profile
GET    /api/users/:userId/records
```

---

### 互动相关 API（第二阶段）

```javascript
// 预留接口，暂不实现
POST   /api/rankings/:recordId/like
DELETE /api/rankings/:recordId/like
POST   /api/rankings/:recordId/comments
GET    /api/rankings/:recordId/comments
```

---

### 统计相关 API（第二阶段）

```javascript
// 预留接口，暂不实现
GET /api/stats/sinner/:sinnerId
GET /api/stats/daily/:date
GET /api/stats/trending
```

---

## 🛡️ 防作弊逻辑（MVP实现）

### 检查项
```javascript
1. 时间合理性
   - 最快时间检查（不低于游戏设计下限）
   - 异常标记：suspicious_time

2. 重复提交检查
   - 相同玩家 + 罪人 + 人格 + 时间 ± 5秒
   - 异常标记：duplicate_detected

3. 提交频率限制
   - 同一玩家24小时内最多N次
   - 异常标记：rate_limit_exceeded

4. EGO一致性检查
   - EGO是否属于该罪人
   - 异常标记：invalid_ego

【结果】
status: "verified" （正常）or "disputed" （可疑）
antiCheatFlags: [] （标记的异常项）
```

---

## 🔄 实现阶段规划

### Phase 1：MVP（当前）
```
✅ 排行榜CRUD
✅ 防作弊检查
✅ 实时查询
✅ 基础筛选排序
❌ 用户认证
❌ 互动功能
❌ 数据分析
```

### Phase 2：社区化
```
✅ 用户认证系统
✅ 个人主页
✅ 评论互动
✅ 点赞功能
✅ 用户等级系统
```

### Phase 3：数据分析
```
✅ 热度榜单
✅ 通关统计
✅ EGO分析
✅ 趋势图表
```

---

## 💡 代码注释规范

### 标记当前实现阶段
```javascript
// Phase 1: MVP必需
// 立即实现

// Phase 2: 用户认证/个人资料
// 第二阶段实现

// Phase 3: 数据分析
// 第三阶段实现

// RESERVED: 预留字段
// 不需要实现，但确保数据库有此字段
```

### 示例
```javascript
// 提交排行榜 [Phase 1: MVP必需]
async function submitRanking(data) {
  // 验证必需字段 [Phase 1]
  validateRequired(data, ['username', 'sinner', 'time'])
  
  // 防作弊检查 [Phase 1]
  const antiCheatResult = await performAntiCheatCheck(data)
  
  // 关联用户ID [Phase 2: 用户认证]
  // if (currentUser) { data.userId = currentUser._id }
  
  // 生成统计 [Phase 3: 数据分析]
  // await updateDailyStats(data.sinnerId, data)
  
  // 保存到数据库
  return await db.collection('rankings').add(data)
}
```

---

## 🎁 扩展点设计

### 容易添加的功能（不需要修改现有代码）

1. **用户认证**
   - 新建 `userController.js`
   - 在提交前加中间件检查token
   - 自动填充userId

2. **评论系统**
   - 新建 `commentController.js`
   - 调用评论API即可
   - Rankings中预留了commentCount字段

3. **点赞功能**
   - 新建 `likeController.js`
   - 调用点赞API即可
   - Rankings中预留了likeCount字段

4. **数据分析**
   - 新建 `statsController.js`
   - 定期计算stats集合
   - 调用分析API即可

5. **截图上传**
   - 集成腾讯云COS SDK
   - 上传前调用uploadScreenshot()
   - 返回URL存入screenshotUrl字段

---

## 📝 总结

这个设计的核心优势：

| 优势 | 说明 |
|------|------|
| **现在简单** | MVP只做排行榜，代码少 |
| **将来完整** | 所有数据结构已设计好 |
| **易于扩展** | 新增功能只需补充controller和API |
| **无需重构** | 现有代码可完全保留 |
| **向后兼容** | 新字段不影响现有查询 |

---
