// server/utils/dataImporter.js
const fs = require('fs');
const Node = require('../models/Node');
const Link = require('../models/Link');

const importData = async () => {
  try {
    const data = fs.readFileSync('data.json', 'utf8');
    const { nodes, links } = JSON.parse(data);

    // 转换节点数据格式（增强清洗逻辑）
    const formattedNodes = nodes.map(node => ({
      id: node.id,
      label: node.label || '未命名节点', // 必填字段兜底
      type: node.type || 'unknown',
      timeline_start: Number(node.timeline?.start) || 1900,
      timeline_end: Number(node.timeline?.end) || null,
      description: node.attributes?.description || '暂无描述',
      imageUrl: node.attributes?.imageUrl || '',
      relatedEvents: (node.attributes?.relatedEvents || []).join(',') // 处理空数组
    }));

    // 验证节点ID唯一性
    const nodeIds = new Set();
    formattedNodes.forEach(node => {
      if (nodeIds.has(node.id)) {
        throw new Error(`重复节点ID: ${node.id}`);
      }
      nodeIds.add(node.id);
    });

    // 验证链接有效性
    const linkPromises = links.map(async link => {
      const sourceExists = await Node.findByPk(link.source);
      const targetExists = await Node.findByPk(link.target);
      if (!sourceExists || !targetExists) {
        console.warn(`无效链接被跳过: ${link.source} -> ${link.target}`);
        return null;
      }
      return link;
    });

    const validLinks = (await Promise.all(linkPromises)).filter(Boolean);

    // 清空并插入数据
    await Node.destroy({ where: {} });
    await Link.destroy({ where: {} });
    await Node.bulkCreate(formattedNodes);
    await Link.bulkCreate(validLinks);

    console.log(`成功导入 ${formattedNodes.length} 个节点，${validLinks.length} 条链接`);
  } catch (error) {
    console.error('数据导入失败:', error);
    process.exit(1);
  }
};

importData();