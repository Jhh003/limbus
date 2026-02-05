# 🚀 快速部署到你的服务器

## 📋 前置要求

你的服务器需要：
- ✅ Node.js 14+ 环境
- ✅ 宝塔面板（已安装）
- ✅ PM2（进程管理，推荐）

---

## 🔧 第一步：在服务器上安装Node.js

### 1. 登录宝塔面板

```
访问你的宝塔面板（需要安全入口）
http://111.231.3.230:8888/xxx  （xxx是你的安全入口）
```

### 2. 安装Node.js

在宝塔面板：
```
软件商店 → 搜索 "Node版本管理器" → 安装
安装完成后 → 点击"设置" → 安装 Node.js 18.x
```

或者通过SSH命令：
```bash
# 更新系统
yum update -y  # CentOS/RHEL
# apt update -y  # Ubuntu/Debian

# 安装Node.js 18.x
curl -fsSL https://rpm.nodesource.com/setup_18.x | bash -
yum install -y nodejs

# 验证安装
node -v
npm -v
```

---

## 📦 第二步：上传项目文件

### 方案A：通过宝塔面板上传（推荐）

1. **在宝塔面板创建网站**
   ```
   网站 → 添加站点
   域名：111.231.3.230 或你的域名
   根目录：/www/wwwroot/limbus-ranking
   PHP版本：纯静态
   ```

2. **上传项目文件**
   ```
   - 方式1：宝塔面板 → 文件 → 上传整个项目文件夹
   - 方式2：用FTP工具（FileZilla）上传
   ```

### 方案B：通过Git克隆

```bash
# SSH登录服务器
ssh root@111.231.3.230

# 进入网站目录
cd /www/wwwroot/

# 克隆你的项目（如果有Git仓库）
git clone https://github.com/Jhh003/lam.git limbus-ranking

# 或创建目录后手动上传
mkdir -p limbus-ranking
```

---

## ⚙️ 第三步：安装依赖并启动服务

### 1. 进入服务器目录

```bash
cd /www/wwwroot/limbus-ranking/server
```

### 2. 安装依赖

```bash
npm install
```

### 3. 创建数据库目录

```bash
mkdir -p database
```

### 4. 测试启动

```bash
npm start
```

你应该看到：
```
╔════════════════════════════════════════════╗
║   Limbus Company 排行榜服务已启动          ║
║   端口: 3000                              ║
║   访问: http://localhost:3000            ║
║   API: http://localhost:3000/api         ║
╚════════════════════════════════════════════╝
```

按 `Ctrl+C` 停止测试。

---

## 🔒 第四步：配置PM2守护进程（推荐）

### 1. 安装PM2

```bash
npm install -g pm2
```

### 2. 启动应用

```bash
# 在 server 目录下
cd /www/wwwroot/limbus-ranking/server

# 启动应用
pm2 start app.js --name limbus-ranking

# 设置开机自启
pm2 startup
pm2 save
```

### 3. PM2常用命令

```bash
pm2 list              # 查看所有进程
pm2 logs              # 查看日志
pm2 restart limbus-ranking  # 重启应用
pm2 stop limbus-ranking     # 停止应用
pm2 delete limbus-ranking   # 删除进程
```

---

## 🌐 第五步：配置Nginx反向代理

### 方案A：通过宝塔面板配置（推荐）

1. **打开网站设置**
   ```
   网站 → 找到你的站点 → 设置 → 反向代理 → 添加反向代理
   ```

2. **配置参数**
   ```
   代理名称：limbus-api
   目标URL：http://127.0.0.1:3000
   发送域名：$host
   内容替换：留空
   ```

3. **配置规则**
   ```nginx
   # 在"配置文件"中添加
   location /api/ {
       proxy_pass http://127.0.0.1:3000/api/;
       proxy_set_header Host $host;
       proxy_set_header X-Real-IP $remote_addr;
       proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
   }
   ```

### 方案B：手动编辑Nginx配置

```bash
# 编辑nginx配置
vi /www/server/panel/vhost/nginx/limbus-ranking.conf
```

添加以下内容：
```nginx
server {
    listen 80;
    server_name 111.231.3.230;  # 或你的域名
    
    # 静态文件（前端）
    location / {
        root /www/wwwroot/limbus-ranking;
        index index.html;
        try_files $uri $uri/ /index.html;
    }
    
    # API代理（后端）
    location /api/ {
        proxy_pass http://127.0.0.1:3000/api/;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

重载nginx：
```bash
nginx -t  # 测试配置
nginx -s reload  # 重载配置
```

---

## 🔥 第六步：配置防火墙

### 在宝塔面板

```
安全 → 添加端口规则
端口：3000
协议：TCP
策略：放行
备注：Limbus API
```

### 通过命令行

```bash
# CentOS/RHEL (firewalld)
firewall-cmd --zone=public --add-port=3000/tcp --permanent
firewall-cmd --reload

# Ubuntu/Debian (ufw)
ufw allow 3000/tcp
ufw reload
```

---

## ✅ 第七步：验证部署

### 1. 测试API

```bash
# 健康检查
curl http://111.231.3.230:3000/api/health

# 获取排行榜列表
curl http://111.231.3.230:3000/api/rankings/list
```

### 2. 在浏览器访问

```
前端页面：http://111.231.3.230/
排行榜页面：http://111.231.3.230/global-ranking.html
API测试：http://111.231.3.230/api/health
```

### 3. 测试提交数据

在排行榜页面点击"提交记录"，填写表单提交。

---

## 📊 监控和维护

### 查看日志

```bash
# PM2日志
pm2 logs limbus-ranking

# 实时日志
pm2 logs limbus-ranking --lines 100

# 错误日志
pm2 logs limbus-ranking --err
```

### 数据库备份

```bash
# 备份数据库
cd /www/wwwroot/limbus-ranking/server/database
cp rankings.db rankings.db.backup_$(date +%Y%m%d_%H%M%S)

# 定时备份（添加到crontab）
crontab -e
# 每天凌晨3点备份
0 3 * * * cp /www/wwwroot/limbus-ranking/server/database/rankings.db /www/backup/rankings_$(date +\%Y\%m\%d).db
```

### 性能监控

```bash
# 查看进程状态
pm2 monit

# 查看内存使用
pm2 describe limbus-ranking
```

---

## 🐛 常见问题

### 1. 端口被占用

```bash
# 查看3000端口占用
netstat -tlnp | grep 3000

# 杀死占用进程
kill -9 <PID>
```

### 2. 权限问题

```bash
# 给予执行权限
chmod +x /www/wwwroot/limbus-ranking/server/app.js

# 更改所有者
chown -R www:www /www/wwwroot/limbus-ranking
```

### 3. 数据库错误

```bash
# 检查数据库文件权限
ls -la database/

# 重新初始化数据库
rm database/rankings.db
npm start  # 会自动创建新数据库
```

### 4. API跨域错误

确保 `server/app.js` 中启用了CORS：
```javascript
app.use(cors());  // 已经包含在代码中
```

---

## 🎯 下一步优化（可选）

### 1. 使用域名

在宝塔面板：
```
网站 → 设置 → 域名管理 → 添加域名
然后去域名服务商添加A记录指向：111.231.3.230
```

### 2. 启用HTTPS

在宝塔面板：
```
网站 → 设置 → SSL → Let's Encrypt → 申请证书
```

### 3. 使用MySQL替代SQLite

修改 `server/app.js`：
```javascript
// 替换为MySQL连接
const mysql = require('mysql2');
const pool = mysql.createPool({
    host: 'localhost',
    user: 'your_user',
    password: 'your_password',
    database: 'limbus_ranking'
});
```

### 4. 添加CDN加速

将静态文件（CSS/JS/图片）上传到CDN，提升访问速度。

---

## 📝 部署检查清单

```
部署前
[ ] Node.js已安装（node -v）
[ ] 项目文件已上传
[ ] 依赖已安装（npm install）

部署中
[ ] 后端服务启动成功（npm start）
[ ] PM2守护进程配置完成
[ ] Nginx反向代理配置完成
[ ] 防火墙端口已开放

部署后
[ ] API健康检查通过
[ ] 前端页面可以访问
[ ] 提交数据功能正常
[ ] 排行榜显示正常

优化（可选）
[ ] 配置域名
[ ] 启用HTTPS
[ ] 设置定时备份
[ ] 配置监控告警
```

---

## 🎉 完成！

现在你的排行榜系统已经完整部署，用户可以：
- ✅ 访问你的网站
- ✅ 查看全球排行榜
- ✅ 提交通关记录
- ✅ 筛选和排序数据

**成本估算**：
- 服务器：你已有（¥0额外费用）
- 数据库：SQLite免费
- 总计：**完全免费**！

如有问题，查看日志：`pm2 logs limbus-ranking`
