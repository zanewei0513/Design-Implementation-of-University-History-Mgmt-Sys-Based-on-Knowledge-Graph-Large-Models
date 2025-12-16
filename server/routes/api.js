// server/routes/api.js
const express = require('express');
const router = express.Router();
const Node = require('../models/Node');
const Link = require('../models/Link');


const { validateNode } = require('../middlewares/dataValidator');

router.post('/nodes', validateNode, async (req, res) => {
  // 原有逻辑保持不变
});
// 获取所有节点
router.get('/nodes', async (req, res) => {
  try {
    const nodes = await Node.findAll();
    res.json(nodes);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// 获取所有关系
router.get('/links', async (req, res) => {
  try {
    const links = await Link.findAll();
    res.json(links);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// 创建新的节点
router.post('/nodes', async (req, res) => {
  try {
    const { id, label, type, timeline, description, imageUrl, relatedEvents } = req.body;
    if (!id || !label || !type || !description) {
      return res.status(400).json({ error: "id、label、type和description都是必需的" });
    }
    const newNode = await Node.create({
      id,
      label,
      type,
      timeline_start: timeline?.start || 1900,
      timeline_end: timeline?.end || null,
      description,
      imageUrl,
      relatedEvents: (relatedEvents || []).join(',') || ''
    });
    res.status(201).json(newNode);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// 创建新的关系
router.post('/links', async (req, res) => {
  try {
    const { source, target, relationType, strength } = req.body;
    if (!source || !target || !relationType) {
      return res.status(400).json({ error: "源节点、目标节点和关系类型都是必需的" });
    }
    const newLink = await Link.create({ source, target, relationType, strength });
    res.status(201).json(newLink);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;