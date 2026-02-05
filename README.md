# 🚌 今天蛋筒什么？

<p align="center">
  <img src="https://img.shields.io/badge/边狱公司-随机选择器-c41e3a?style=flat-square" alt="边狱公司">
  <img src="https://img.shields.io/badge/版本-1.5.0-4a90e2?style=flat-square" alt="版本">
  <img src="https://img.shields.io/badge/赛季-第七赛季-ff6b6b?style=flat-square" alt="赛季">
  <img src="https://img.shields.io/badge/许可证-MIT-green?style=flat-square" alt="许可证">
</p>

<p align="center">
  <b>选择困难症患者的福音！</b><br>
  还在为今天用哪个罪人而纠结？让人格筛选器来帮你做决定！
</p>

---

## ✨ 这个项目能做什么？

这是一款专为《边狱公司》（Limbus Company）玩家打造的**罪人人格随机选择器**，帮你摆脱"选择困难症"，让命运来决定今天的搭档！

### 🎯 核心功能

| 功能 | 说明 |
|------|------|
| 🎲 **双级随机抽取** | 先随机选择12名罪人之一，再随机抽取该罪人的特定人格 |
| 🔍 **智能筛选系统** | 可自由设定参与随机的罪人和人格，打造专属池子 |
| ⏱️ **单通计时器** | 内置计时功能，记录你的单通挑战时长 |
| 🏆 **本地排行榜** | 保存你的最佳战绩，见证自己的成长 |
| 🎨 **沉浸式UI** | 边狱巴士风格设计，原汁原味的美学体验 |
| 📱 **全平台支持** | 电脑、平板、手机，随时随地都能用 |

---

## 🚀 马上开始

### 在线使用

👉 **[点击体验在线版](https://jhh003.github.io/limbus/)**

无需安装，打开浏览器即可使用！

### 本地运行

想要在本地运行？简单三步：

```bash
# 1. 下载项目
git clone https://github.com/Jhh003/limbus.git

# 2. 进入目录
cd limbus

# 3. 用浏览器打开 index.html
# 或者启动本地服务器：
python -m http.server 8000
```

然后访问 `http://localhost:8000` 即可。

---

## 📖 使用指南

### 基础玩法

1. **进入筛选设置** → 选择你想参与的罪人和人格
2. **返回主界面** → 点击"开始滚动"抽取罪人
3. **确定罪人后** → 二级选择器自动解锁
4. **再次滚动** → 抽取最终人格
5. **接受命运** → 开始你的冒险！

### 进阶技巧

- 💡 **只选一个罪人**：如果只想随机某罪人的不同人格，筛选时只勾选该罪人即可
- 💡 **限定人格池子**：可以只开启特定罪人的几个人格，缩小随机范围
- 💡 **全随机挑战**：全部勾选，体验真正的"地狱难度"

---

## 📸 界面预览

> *简洁优雅的边狱风格界面，流畅的滚动动画效果*

*截图区域 - 建议添加实际使用截图*

---

## 🛠️ 技术栈

- **前端**：HTML5 + CSS3 + JavaScript (ES6+)
- **样式**：原生 CSS + 边狱主题定制
- **图标**：Font Awesome
- **字体**：Noto Serif SC（中文）、Cinzel（英文装饰）

---

## 📂 项目结构

```
limbus/
├── 📁 assets/          # 图片、字体等资源文件
│   └── 📁 images/      # 罪人头像
├── 📁 css/             # 样式文件
│   ├── reset.css       # 重置样式
│   ├── common.css      # 通用样式
│   ├── season.css      # 赛季主题
│   └── 📁 module/      # 模块化样式
├── 📁 js/              # JavaScript 模块
│   ├── main.js         # 主程序入口
│   ├── modal.js        # 弹窗组件
│   ├── ui.js           # UI 交互
│   └── 📁 controllers/ # 功能控制器
├── 📁 data/            # 数据文件
│   ├── characters.js   # 罪人数据
│   └── config.js       # 配置常量
└── index.html          # 主页面
```

---

## 🔄 更新日志

### v1.5.0（最新）
- ✨ 重构上传界面，操作更清晰
- ✨ 支持两种记录类型：完整记录 / 仅层数记录
- ✨ 优化移动端体验

### v1.4.0
- ✨ 新增单通层数排行榜
- ✨ 支持记录 5/10/15 层单通成就

### v1.3.0
- ✨ 新增本地排行榜功能
- ✨ 内置单通计时器

### v1.2.0
- ✨ 添加彩蛋视频功能
- ✨ 优化筛选逻辑

### v1.1.0
- ✨ 模块化代码重构
- ✨ 分离数据与逻辑

---

## 🤝 参与贡献

欢迎提交 Issue 和 Pull Request！

- 🐛 发现 Bug？请提交 Issue 描述问题
- 💡 有新想法？欢迎提出建议
- 🔧 想要改进？Fork 后提交 PR

---

## 🙏 特别感谢

- 游戏数据与图片来源于 [边狱公司中文维基](https://limbuscompany.huijiwiki.com/)
- 感谢所有提供反馈和建议的玩家们
- 本项目为粉丝作品，与 Project Moon 官方无关

---

## 📜 许可证

[MIT License](LICENSE) © 2025

---

<p align="center">
  <b>祝大家单通顺利，金光满满！🎉</b><br>
  <sub> made with ❤️ for Limbus Company players</sub>
</p>

<p align="center">
  <a href="https://github.com/Jhh003/limbus">⭐ 觉得好用的话，点个 Star 吧！</a>
</p>
