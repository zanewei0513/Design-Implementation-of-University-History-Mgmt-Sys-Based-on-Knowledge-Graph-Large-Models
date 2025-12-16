const express = require('express');
const axios = require('axios');
const cors = require('cors');
const sequelize = require('./config/database'); 
const HistoryEvent = require('./models/HistoryEvent-mysql');
const HistoryFigure = require('./models/HistoryFigure-mysql');
const News = require('./models/News');
const { crawlBduNews } = require('./crawler');

const apiRoutes = require('./routes/api');

const app = express();
const port = 3000;

// 中间件配置
app.use(cors());
app.use(express.json());
app.use('/api', apiRoutes);


app.post('/call-ai-model', async (req, res) => {
    try {
        const input = req.body.input;
        if (!input) return res.status(400).json({ error: "Missing input field" });
        
        res.writeHead(200, {
            'Content-Type': 'text/event-stream',
            'Cache-Control': 'no-cache',
            'Connection': 'keep-alive'
        });
        const cozeResponse = await axios({
            method: 'post',
            url: 'https://api.coze.cn/v3/chat',
            headers: {
                'Authorization': 'Bearer pat_YppnHbVyAYZ063Qnf8bpPqFP06JVL9R5gGpg2mFTsmgMfYeZSBzxUr4Rm9sFkQqD',
                'Content-Type': 'application/json'
            },
            data: {
                bot_id: "7444077904541319202",
                user_id: "gxj",
                stream: true,
                additional_messages: [{
                    role: "user",
                    content: input,
                    content_type: "text"
                }]
            },
            responseType: 'stream'
        });
        // ========== 增强处理逻辑 ==========
        let buffer = '';
        let currentEventType = '';
        let shouldStop = false;
        cozeResponse.data.on('data', chunk => {
            if (shouldStop) return;
            try {
                buffer += chunk.toString();
                const lines = buffer.split(/(\r\n|\r|\n)/);
                buffer = lines.pop() || ''; // 保留未完成行
                lines.forEach(line => {
                    line = line.trim();
                    if (!line) return;
                    // 处理事件类型
                    if (line.startsWith('event:')) {
                        currentEventType = line.replace('event:', '').trim();
                        return;
                    }
                    // 仅处理目标事件的数据
                    if (line.startsWith('data:') && currentEventType === 'conversation.message.delta') {
                        const jsonStr = line.slice(5).trim();
                        try {
                            const jsonData = JSON.parse(jsonStr);
                            let content = jsonData.content || '';
                            
                            // 调试输出
                            console.log('[有效内容]', JSON.stringify({
                                content: content,
                                length: content.length
                            }));
                            // 构造传输数据
                            res.write(`data: ${JSON.stringify({
                                content: content,
                                eventType: currentEventType
                            })}\n\n`);
                        } catch (e) {
                            console.error('JSON解析错误:', e.message);
                        }
                    }
                });
            } catch (e) {
                console.error('流处理异常:', e);
            }
        });
        cozeResponse.data.on('end', () => {
            if (!shouldStop) {
                res.write('data: [DONE]\n\n');
                res.end();
            }
            console.log('[传输结束]');
        });
    } catch (error) {
        console.error('API Error:', error);
        res.status(500).json({ error: "服务暂时不可用" });
    }
});

// 获取所有历史事件
app.get('/api/history-events', async (req, res) => {
    try {
        console.log('正在获取历史事件...');
        const events = await HistoryEvent.findAll({
            order: [['year', 'ASC']]
        });
        console.log(`成功获取 ${events.length} 条历史事件`);
        res.json(events);
    } catch (error) {
        console.error('获取历史事件失败:', error);
        res.status(500).json({ 
            error: "获取历史事件失败",
            details: error.message 
        });
    }
});

// 获取所有历史人物
app.get('/api/history-figures', async (req, res) => {
    try {
        console.log('正在获取历史事件...');
        const events = await HistoryFigure.findAll({
            order: [['id', 'ASC']]
        });
        console.log(`成功获取 ${events.length} 个历史人物记录`);
        res.json(events);
    } catch (error) {
        console.error('获取历史人物记录失败:', error);
        res.status(500).json({ 
            error: "获取历史人物记录失败",
            details: error.message 
        });
    }
});

// 获取新闻列表
app.get('/api/news', async (req, res) => {
    try {
        console.log('正在获取新闻列表...');
        const news = await News.findAll({
            order: [['date', 'DESC']],
            limit: 8
        });
        console.log(`成功获取 ${news.length} 条新闻`);
        res.json(news);
    } catch (error) {
        console.error('获取新闻失败:', error);
        console.error('错误详情:', error.stack);
        res.status(500).json({ 
            error: '获取新闻失败',
            details: error.message 
        });
    }
});

// 创建新的历史事件
app.post('/api/history-events', async (req, res) => {
    try {
        const { year, event } = req.body;
        
        if (!year || !event) {
            return res.status(400).json({ 
                error: "年份和事件内容都是必需的" 
            });
        }

        const newEvent = await HistoryEvent.create({ year, event });
        console.log('成功创建新的历史事件:', newEvent.toJSON());
        res.status(201).json(newEvent);
    } catch (error) {
        console.error('创建历史事件失败:', error);
        res.status(500).json({ 
            error: "创建历史事件失败",
            details: error.message 
        });
    }
});

// 创建新的历史人物记录
app.post('/api/history-figures', async (req, res) => {
    try {
        const { name, intro, maint, image_url } = req.body;
        
        if (!name || !intro || !maint) {
            return res.status(400).json({ 
                error: "姓名、简介和主要事迹都是必需的" 
            });
        }

        const newFigure = await HistoryFigure.create({ 
            name, 
            intro, 
            maint, 
            image_url: image_url || null 
        });
        console.log('成功创建新的历史人物记录:', newFigure.toJSON());
        res.status(201).json(newFigure);
    } catch (error) {
        console.error('创建历史人物记录:', error);
        res.status(500).json({ 
            error: "创建历史人物记录",
            details: error.message 
        });
    }
});

// 错误处理中间件
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ 
        error: "服务器内部错误",
        details: err.message 
    });
});

// 初始化函数
const initServer = async () => {
    try {


        // 启动爬虫
        console.log('开始初始化新闻爬虫...');
        await crawlBduNews();
        console.log('新闻爬虫初始化完成');

        // 同步数据库
        await sequelize.sync({ force: false });
        console.log('数据库模型同步完成');


        // 设置定时任务，每小时更新一次新闻
        setInterval(async () => {
            try {
                console.log('开始定时更新新闻...');
                await crawlBduNews();
                console.log('定时更新新闻完成');
            } catch (error) {
                console.error('定时更新新闻失败:', error);
            }
        }, 1000 * 60 * 60); // 每小时执行一次

    } catch (error) {
        console.error('服务器初始化失败:', error);
    }
};

// 启动服务器
app.listen(port, () => {
    console.log(`服务器运行在 http://localhost:${port}`);
    initServer();  // 调用初始化函数
});
