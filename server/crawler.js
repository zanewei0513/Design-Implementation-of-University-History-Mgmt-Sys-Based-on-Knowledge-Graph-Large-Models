const puppeteer = require('puppeteer');
const News = require('./models/News');
const sequelize = require('./config/database');

async function crawlPageNews(page, url, retryCount = 5) {
    for (let i = 0; i < retryCount; i++) {
        try {
            // 随机延迟 2-5 秒
            await new Promise(resolve => setTimeout(resolve, 2000 + Math.random() * 3000));
            
            // 访问页面
            const response = await page.goto(url);

            if (!response.ok()) {
                throw new Error(`页面加载失败: ${response.status()} ${response.statusText()}`);
            }

            // 等待页面加载完成
            await page.waitForFunction(() => document.readyState === 'complete');

            // 更新选择器列表
            const selectors = [
                '[id^="line_u8_"]',    // 使用以 line_u8_ 开头的 id 选择器
                '.list ul li'          // 备用选择器
            ];
            let elements = null;

            for (const selector of selectors) {
                try {
                    await page.waitForSelector(selector, { 
                        timeout: 5000,
                        visible: true 
                    });
                    elements = await page.$$(selector);
                    if (elements.length > 0) break;
                } catch (e) {
                    console.log(`选择器 ${selector} 未找到，尝试下一个...`);
                }
            }

            if (!elements || elements.length === 0) {
                throw new Error('未找到新闻列表元素');
            }

            // 提取新闻数据
            return await page.evaluate(() => {
                const getNewsItems = () => {
                    // 使用 id 属性选择器获取所有新闻项
                    const items = Array.from(document.querySelectorAll('[id^="line_u8_"]'));
                    if (items.length > 0) return items;
                    
                    // 如果上面的选择器没有找到元素，尝试备用选择器
                    return Array.from(document.querySelectorAll('.list ul li') || []);
                };

                return getNewsItems().map(item => {
                    const link = item.querySelector('a');
                    const dateElement = item.querySelector('i');  // 日期在 i 标签中

                    let dateStr = dateElement?.textContent?.trim() || '';
                    // 移除方括号
                    dateStr = dateStr.replace(/[\[\]]/g, '');

                    // 确保链接是完整的 URL
                    const url = link?.href ? new URL(link.href, window.location.origin).href : '';

                    return {
                        title: link?.textContent?.trim() || '',
                        url: url,
                        date: dateStr
                    };
                }).filter(item => item.title && item.url);
            });

        } catch (error) {
            console.log(`第 ${i + 1} 次尝试访问 ${url} 失败:`, error.message);
            if (i === retryCount - 1) throw error;
            await new Promise(resolve => setTimeout(resolve, 5000 + Math.random() * 5000));
        }
    }
}

async function updateDatabase(newsItems) {
    const transaction = await sequelize.transaction();
    try {
        // 删除旧新闻
        await News.destroy({
            where: {},
            transaction
        });

        // 按日期排序并只取最新的20条新闻
        const sortedNews = newsItems.sort((a, b) => {
            const dateA = new Date(a.date);
            const dateB = new Date(b.date);
            return dateB - dateA;
        }).slice(0, 20);

        // 插入新新闻
        await News.bulkCreate(sortedNews.map(item => ({
            title: item.title,
            url: item.url,
            date: new Date(item.date)
            // created_at 会自动设置为当前时间
        })), {
            transaction
        });

        await transaction.commit();
        console.log('数据库更新成功，已保存最新的20条新闻');
    } catch (error) {
        await transaction.rollback();
        console.error('数据库更新失败:', error);
        throw error;
    }
}

async function crawlBduNews() {
    const browser = await puppeteer.launch({
        headless: true,
        args: [
            '--no-sandbox',
            '--disable-setuid-sandbox',
            '--disable-dev-shm-usage',
            '--disable-web-security',
            '--ignore-certificate-errors',
            '--window-size=1920x1080'
        ],
        ignoreHTTPSErrors: true,
        timeout: 60000
    });
    
    const page = await browser.newPage();
    await page.setDefaultNavigationTimeout(60000);
    
    // 设置更现代的 User-Agent
    await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36');

    try {
        // 要爬取的页面URL列表
        const urls = [
            'https://www.bdu.edu.cn/syxw/zhxw.htm',      // 综合新闻
            'https://www.bdu.edu.cn/syxw/xsdt.htm',      // 学术动态
            'https://www.bdu.edu.cn/syxw/tzgg.htm',      // 通知公告
            'https://www.bdu.edu.cn/syxw/xxyw.htm',      // 学校要闻
        ];

        // 串行爬取所有页面，为每个页面创建新的Page实例
        const newsFromAllPages = [];
        for (const url of urls) {
            const newPage = await browser.newPage();
            await newPage.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36');
            try {
                const newsItems = await crawlPageNews(newPage, url);
                newsFromAllPages.push(newsItems);
            } finally {
                await newPage.close();
            }
        }

        // 合并所有新闻并按来源分类
        const newsBySource = {};
        newsFromAllPages.forEach((newsArray, index) => {
            const source = urls[index].includes('/zhxw.htm') ? '综合新闻' :
                          urls[index].includes('/xsdt.htm') ? '学术动态' :
                          urls[index].includes('/tzgg.htm') ? '通知公告' :
                          '学校要闻';
            
            // 对每个分类的新闻进行日期排序
            const sortedNews = newsArray.sort((a, b) => {
                const dateA = new Date(a.date);
                const dateB = new Date(b.date);
                return dateB - dateA;
            });
            
            newsBySource[source] = sortedNews.slice(0, 5); // 只取前5条
        });

        // 打印每个分类的新闻
        console.log('\n=== 爬取结果 ===');
        Object.entries(newsBySource).forEach(([source, news]) => {
            console.log(`\n${source}:`);
            console.log('----------------------------------------');
            news.forEach((item, index) => {
                console.log(`${index + 1}. ${item.title}`);
                console.log(`   日期: ${item.date}`);
                console.log(`   链接: ${item.url}\n`);
            });
        });

        // 合并所有新闻用于返回
        const allNews = Object.values(newsBySource).flat();
        
        // 更新数据库
        await updateDatabase(allNews);
        
        return allNews;

    } catch (error) {
        console.error('爬取新闻失败:', error);
        throw error;
    } finally {
        await browser.close();
    }
}

// 删除或注释这部分代码，因为已经移到 server.js 中了
/*
const updateNewsInterval = 1000 * 60 * 60; 
setInterval(async () => {
    try {
        await crawlBduNews();
        console.log('定时更新新闻完成');
    } catch (error) {
        console.error('定时更新新闻失败:', error);
    }
}, updateNewsInterval);
*/

module.exports = { crawlBduNews };