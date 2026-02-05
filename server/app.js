/**
 * Limbus Company 排行榜后端服务
 */

const express = require('express');
const cors = require('cors');
const fs = require('fs').promises;
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// 中间件
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, '..')));

// 数据库文件路径
const DB_FILE = path.join(__dirname, 'database', 'rankings.json');

// 数据库初始化
async function initDatabase() {
    try {
        const dir = path.join(__dirname, 'database');
        await fs.mkdir(dir, { recursive: true });
        
        try {
            await fs.access(DB_FILE);
            console.log('✅ 数据库文件已存在');
        } catch {
            await fs.writeFile(DB_FILE, JSON.stringify({ rankings: [], nextId: 1 }, null, 2));
            console.log('✅ 数据库文件已创建');
        }
    } catch (error) {
        console.error('数据库初始化失败:', error);
    }
}

// 读取数据库
async function readDatabase() {
    try {
        const data = await fs.readFile(DB_FILE, 'utf8');
        return JSON.parse(data);
    } catch (error) {
        console.error('读取数据库失败:', error);
        return { rankings: [], nextId: 1 };
    }
}

// 写入数据库
async function writeDatabase(data) {
    try {
        await fs.writeFile(DB_FILE, JSON.stringify(data, null, 2));
    } catch (error) {
        console.error('写入数据库失败:', error);
        throw error;
    }
}

initDatabase();

// ==================== API 路由 ====================

/**
 * 提交排行榜记录
 * POST /api/rankings/submit
 */
app.post('/api/rankings/submit', async (req, res) => {
    try {
        const {
            username,
            sinner,
            persona,
            time,
            floorLevel,
            egoGifts,
            combatPassives,
            supportPassives,
            screenshotUrl,
            videoUrl,
            notes
        } = req.body;

        // 数据验证
        if (!username || !sinner || !persona || !time || !floorLevel) {
            return res.status(400).json({
                code: 400,
                message: '缺少必填字段'
            });
        }

        // 防作弊：检查楼层范围（1-15层，第5层分普牢和困牢：5-1, 5-2）
        const validFloors = ['1', '2', '3', '4', '5-1', '5-2', '6', '7', '8', '9', '10', '11', '12', '13', '14', '15'];
        if (!validFloors.includes(floorLevel.toString())) {
            return res.status(400).json({
                code: 400,
                message: '楼层数值不合法（1-15层，第5层可选普牢5-1或困牢5-2）'
            });
        }

        // 插入数据库（状态为待审核）
        const db = await readDatabase();
        
        const newRecord = {
            id: db.nextId++,
            username,
            sinner,
            persona,
            time,
            floor_level: floorLevel,
            ego_gifts: egoGifts || [],
            combat_passives: combatPassives || [],
            support_passives: supportPassives || [],
            screenshot_url: screenshotUrl || null,
            video_url: videoUrl || null,
            notes: notes || null,
            status: 'pending', // 待审核状态
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
        };

        db.rankings.push(newRecord);
        await writeDatabase(db);

        res.json({
            code: 200,
            success: true,
            message: '提交成功！请等待审核',
            data: {
                id: newRecord.id
            }
        });

    } catch (error) {
        console.error('提交排行榜错误:', error);
        res.status(500).json({
            code: 500,
            message: '服务器错误'
        });
    }
});

/**
 * 获取排行榜列表
 * GET /api/rankings/list
 */
app.get('/api/rankings/list', async (req, res) => {
    try {
        const {
            sinner,
            floorLevel,
            sortBy = 'time',
            sortOrder = 'asc',
            page = 1,
            limit,
            pageSize
        } = req.query;

        // 支持 limit 和 pageSize 两个参数名称
        const pageSizeValue = limit || pageSize || 20;
        const db = await readDatabase();
        // 只返回已审核通过的数据
        let records = db.rankings.filter(r => r.status === 'approved');

        // 筛选条件
        if (sinner && sinner !== 'all') {
            records = records.filter(r => r.sinner === sinner);
        }
        if (floorLevel && floorLevel !== 'all') {
            records = records.filter(r => r.floor_level === parseInt(floorLevel));
        }

        // 排序
        const validSortFields = ['time', 'created_at', 'floor_level'];
        const sortField = validSortFields.includes(sortBy) ? sortBy : 'time';
        records.sort((a, b) => {
            const aVal = a[sortField];
            const bVal = b[sortField];
            return sortOrder === 'desc' ? bVal - aVal : aVal - bVal;
        });

        // 分页
        const total = records.length;
        const startIndex = (parseInt(page) - 1) * parseInt(pageSizeValue);
        const paginatedRecords = records.slice(startIndex, startIndex + parseInt(pageSizeValue));

        res.json({
            code: 200,
            success: true,
            data: {
                records: paginatedRecords,
                pagination: {
                    page: parseInt(page),
                    pageSize: parseInt(pageSizeValue),
                    total,
                    totalPages: Math.ceil(total / parseInt(pageSizeValue))
                }
            }
        });

    } catch (error) {
        console.error('获取排行榜错误:', error);
        res.status(500).json({
            code: 500,
            message: '服务器错误'
        });
    }
});

/**
 * 获取单条记录详情
 * GET /api/rankings/:id
 */
app.get('/api/rankings/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const db = await readDatabase();
        
        const record = db.rankings.find(r => r.id === parseInt(id));

        if (!record) {
            return res.status(404).json({
                code: 404,
                message: '记录不存在'
            });
        }

        res.json({
            code: 200,
            data: record
        });
    } catch (error) {
        console.error('查询失败:', error);
        res.status(500).json({
            code: 500,
            message: '查询失败'
        });
    }
});

/**
 * 删除记录
 * DELETE /api/rankings/:id
 */
app.delete('/api/rankings/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const db = await readDatabase();
        
        const index = db.rankings.findIndex(r => r.id === parseInt(id));

        if (index === -1) {
            return res.status(404).json({
                code: 404,
                message: '记录不存在'
            });
        }

        db.rankings.splice(index, 1);
        await writeDatabase(db);

        res.json({
            code: 200,
            message: '删除成功'
        });
    } catch (error) {
        console.error('删除失败:', error);
        res.status(500).json({
            code: 500,
            message: '删除失败'
        });
    }
});

/**
 * 获取待审核列表（管理后台用）
 * GET /api/rankings/pending
 */
app.get('/api/rankings/pending', async (req, res) => {
    try {
        const db = await readDatabase();
        const pendingRecords = db.rankings.filter(r => r.status === 'pending');
        
        res.json({
            code: 200,
            data: pendingRecords
        });
    } catch (error) {
        console.error('获取待审核列表错误:', error);
        res.status(500).json({
            code: 500,
            message: '服务器错误'
        });
    }
});

/**
 * 审核记录（管理后台用）
 * POST /api/rankings/approve/:id
 */
app.post('/api/rankings/approve/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const { action } = req.body; // 'approve' 或 'reject'
        
        const db = await readDatabase();
        const record = db.rankings.find(r => r.id === parseInt(id));
        
        if (!record) {
            return res.status(404).json({
                code: 404,
                message: '记录不存在'
            });
        }
        
        if (action === 'approve') {
            record.status = 'approved';
        } else if (action === 'reject') {
            record.status = 'rejected';
        } else {
            return res.status(400).json({
                code: 400,
                message: '无效的操作'
            });
        }
        
        record.updated_at = new Date().toISOString();
        await writeDatabase(db);
        
        res.json({
            code: 200,
            message: action === 'approve' ? '审核通过' : '已拒绝'
        });
    } catch (error) {
        console.error('审核错误:', error);
        res.status(500).json({
            code: 500,
            message: '服务器错误'
        });
    }
});

/**
 * 健康检查
 * GET /api/health
 */
app.get('/api/health', (req, res) => {
    res.json({
        code: 200,
        message: 'Limbus Company 排行榜 API 运行正常',
        timestamp: new Date().toISOString()
    });
});

// ==================== 启动服务器 ====================

app.listen(PORT, () => {
    console.log(`
╔════════════════════════════════════════════╗
║   Limbus Company 排行榜服务已启动          ║
║   端口: ${PORT}                              ║
║   访问: http://localhost:${PORT}            ║
║   API: http://localhost:${PORT}/api         ║
╚════════════════════════════════════════════╝
    `);
});

// 优雅关闭
process.on('SIGINT', () => {
    console.log('\n正在关闭服务器...');
    console.log('✅ 服务器已关闭');
    process.exit(0);
});
