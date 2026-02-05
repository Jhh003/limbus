# 腾讯云排行榜系统 - 实现路线图

## 📋 项目概览

这是一个**分阶段实现**的排行榜系统，设计理念是：

> **现在做简单的（MVP），为未来的功能留下清晰的接口**

---

## 🎯 三个实现阶段

### Phase 1: MVP - 基础排行榜（当前）
- ✅ 排行榜展示
- ✅ 基础筛选和排序
- ✅ 防作弊检查
- ✅ 实时查询
- ❌ 用户认证（预留）
- ❌ 互动功能（预留）

**时间**: 1-2周  
**成本**: ¥0-20/月  
**复杂度**: 低

---

### Phase 2: 社区化 - 用户和互动
- ✅ 用户注册登录
- ✅ 个人主页和成绩追踪
- ✅ 评论系统
- ✅ 点赞互动
- ✅ 用户等级和成就

**时间**: 2-3周（在Phase 1基础上）  
**成本**: ¥20-50/月  
**复杂度**: 中

---

### Phase 3: 高级功能 - 数据和分析
- ✅ 热度排行
- ✅ 通关统计
- ✅ EGO分析
- ✅ 趋势图表
- ✅ 赛季数据

**时间**: 2-3周（在Phase 2基础上）  
**成本**: ¥30-60/月  
**复杂度**: 中

---

## 📁 项目文件结构

### 数据库文档
```
docs/technical/CLOUDBASE_DESIGN.md
├── 数据库字段设计（一步到位）
├── API接口规范（完整设计）
├── 防作弊逻辑
└── 阶段实现指南
```

### 前端代码
```
js/
├── api/
│   └── cloudbaseApi.js          # CloudBase SDK包装器
│       ├── [Phase 1] 排行榜CRUD
│       ├── [Phase 2] 用户认证接口（预留）
│       └── [Phase 3] 统计接口（预留）
│
└── controllers/
    └── globalRankingController.js  # 排行榜控制器
        ├── [Phase 1] 列表渲染、筛选、排序
        ├── [Phase 2] 删除、评论、点赞（预留）
        └── [Phase 3] 实时更新（预留）

pages/
├── global-ranking.html          # 全球排行榜页面
├── login.html                   # 登录页面 [Phase 2]
├── user-profile.html            # 个人主页 [Phase 2]
└── analytics.html               # 数据分析 [Phase 3]

css/module/
└── global-ranking.css           # 排行榜样式
```

---

## 🔧 实现检查清单

### Phase 1: MVP 排行榜（现在做）

#### 后端部分（腾讯云CloudBase）
```
[ ] 创建环境和数据库
    [ ] 创建CloudBase环境
    [ ] 创建 rankings 集合
    [ ] 创建必要的索引
    [ ] 配置访问权限

[ ] 创建云函数（API）
    [ ] POST /api/rankings/submit      (排行榜提交 + 防作弊)
    [ ] GET /api/rankings/list         (排行榜列表 + 筛选排序)
    [ ] GET /api/rankings/:id          (单条记录详情)
    [ ] DELETE /api/rankings/:id       (删除记录)

[ ] 防作弊逻辑实现
    [ ] 时间合理性检查
    [ ] 重复提交检查
    [ ] 提交频率限制
    [ ] EGO一致性验证
```

#### 前端部分
```
[ ] 集成CloudBase SDK
    [ ] 在 index.html 引入SDK脚本
    [ ] 初始化CloudBase环境

[ ] 修改现有上传功能
    [ ] 修改 uploadController.js
    [ ] 调用新的 CloudBase API
    [ ] 处理防作弊警告

[ ] 开发全球排行榜页面
    [ ] 完成 global-ranking.html
    [ ] 完成 globalRankingController.js
    [ ] 完成样式 global-ranking.css
    [ ] 测试筛选和排序

[ ] 页面集成
    [ ] 在 index.html 导航栏添加"全球排行榜"链接
    [ ] 测试从主页到排行榜的跳转
    [ ] 测试排行榜的所有功能
```

#### 测试和部署
```
[ ] 本地测试
    [ ] 测试排行榜提交
    [ ] 测试防作弊检查
    [ ] 测试筛选排序
    [ ] 测试分页
    [ ] 测试实时更新

[ ] 腾讯云部署
    [ ] 部署CloudBase函数
    [ ] 配置CORS
    [ ] 测试线上环境
    [ ] 监控性能

[ ] 用户测试
    [ ] 邀请内测用户
    [ ] 收集反馈
    [ ] 修复bug
```

---

### Phase 2: 社区化（之后做）

#### 后端部分
```
[ ] 创建User集合和认证
    [ ] 创建 users 集合
    [ ] 实现JWT token机制
    [ ] 创建 register 和 login 云函数

[ ] 创建Comment集合和API
    [ ] 创建 comments 集合
    [ ] 创建 POST /api/rankings/:id/comments
    [ ] 创建 GET /api/rankings/:id/comments
    [ ] 创建 DELETE /api/comments/:id

[ ] 实现互动功能
    [ ] 实现点赞系统
    [ ] 更新 rankings 的 likeCount
    [ ] 实现关注系统
```

#### 前端部分
```
[ ] 创建认证系统
    [ ] 创建 login.html 和 register.html
    [ ] 实现 authController.js
    [ ] 集成token管理

[ ] 创建个人主页
    [ ] 创建 user-profile.html
    [ ] 显示用户成绩
    [ ] 显示用户成就

[ ] 扩展排行榜功能
    [ ] 添加评论显示
    [ ] 实现点赞功能
    [ ] 添加用户信息卡片
```

---

### Phase 3: 数据分析（之后做）

#### 后端部分
```
[ ] 创建Stats集合
    [ ] 创建 stats 集合
    [ ] 实现定期统计计算

[ ] 创建分析API
    [ ] GET /api/stats/sinner/:id
    [ ] GET /api/stats/daily/:date
    [ ] GET /api/stats/trending
```

#### 前端部分
```
[ ] 创建分析页面
    [ ] 创建 analytics.html
    [ ] 实现图表显示
    [ ] 显示统计数据
```

---

## 🎓 代码约定

### Phase标记
```javascript
// 每个文件顶部和关键方法都要标记Phase

// Phase 1: MVP必需 - 立即实现
// 这是基础功能，现在就要做

// Phase 2: 用户认证/社交 - 第二阶段实现
// 未来会添加，现在预留接口

// Phase 3: 数据分析 - 第三阶段实现
// 更远期的功能，现在预留数据结构
```

### 接口设计原则
```javascript
// ✅ 好的设计 - 留有扩展空间
class CloudbaseAPI {
  // Phase 1: 实现
  async getRankingList(options) { }
  
  // Phase 2: 预留接口
  async getComments(recordId) {
    logger.warn('评论功能未实现 [Phase 2]');
    return null;
  }
}

// ❌ 坏的设计 - 需要重构
class RankingAPI {
  // 没有为未来功能设计接口
  // 后续添加评论功能时需要大改
}
```

### 数据库字段设计
```javascript
// ✅ 好的设计 - 一步到位
db.collection('rankings').add({
  // Phase 1: 立即使用
  username: 'player',
  sinner: 'Yi Sang',
  time: 7321,
  
  // Phase 2: 预留字段，暂不使用
  userId: null,           // 登录后关联
  likeCount: 0,          // 社交功能
  
  // Phase 3: 预留字段
  gameVersion: '1.5.0'   // 版本追踪
})

// ❌ 坏的设计 - 需要迁移
db.collection('rankings').add({
  // 这样做的话，Phase 2添加评论功能时
  // 发现没有预留字段，需要修改所有记录
})
```

---

## 📊 成本随阶段增长

```
时间轴：
├─ Phase 1: 1-2周      成本: ¥0-20/月
├─ Phase 2: +2-3周     成本: ¥20-50/月
└─ Phase 3: +2-3周     成本: ¥30-60/月
   ────────────
   总计: 5-8周          总成本: ¥30-60/月
```

---

## 🚀 快速开始

### 第一步：建立CloudBase环境
```bash
# 腾讯云官网创建CloudBase环境
# https://console.cloud.tencent.com/tcb
```

### 第二步：下载SDK脚本
```html
<!-- 在 index.html 中添加 -->
<script src="https://imgcache.qq.com/qcloud/cloudbase-js-sdk/1.7.0/cloudbase.js"></script>
```

### 第三步：修改API配置
```javascript
// js/api/cloudbaseApi.js
const cloudbaseAPI = new CloudbaseAPI({
  env: 'YOUR_ACTUAL_ENV_ID',  // 替换成实际的环境ID
  apiBaseUrl: '/api'
});
```

### 第四步：测试连接
```javascript
// 在浏览器控制台测试
cloudbaseAPI.getRankingList()
  .then(data => console.log('连接成功！', data))
  .catch(err => console.log('连接失败', err));
```

---

## 📝 维护手册

### 定期维护任务
```
每周：
[ ] 检查服务器状态
[ ] 查看错误日志
[ ] 监控数据库使用量

每月：
[ ] 统计用户数据
[ ] 清理垃圾记录
[ ] 更新防作弊规则

每季度：
[ ] 备份数据库
[ ] 性能分析
[ ] 规划下一阶段功能
```

### 监控告警
```
关注指标：
- 数据库容量使用率
- API响应时间
- 错误率
- 用户数增长
```

---

## 💡 设计优势总结

| 优势 | 说明 |
|------|------|
| **快速上线** | 先做MVP，可立即上线 |
| **低成本** | 使用腾讯云免费额度，成本很低 |
| **易于维护** | 代码结构清晰，模块独立 |
| **可扩展性强** | 新功能只需补充，无需重构 |
| **向后兼容** | 新字段不影响旧代码 |
| **学习价值** | 展示良好的软件架构设计 |

---

## 🎯 下一步行动

1. **立即**：
   - [ ] 注册腾讯云账号
   - [ ] 阅读CLOUDBASE_DESIGN.md
   - [ ] 复查前端代码框架

2. **本周**：
   - [ ] 创建CloudBase环境
   - [ ] 部署第一个云函数（排行榜提交）
   - [ ] 修改前端集成代码

3. **下周**：
   - [ ] 完成所有Phase 1功能
   - [ ] 本地和线上测试
   - [ ] 内测上线

---

**预计 Phase 1 可在 2周内完成，成本基本为0。** 🎉

