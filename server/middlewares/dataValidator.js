// server/middlewares/dataValidator.js
const validateNode = (req, res, next) => {
    const requiredFields = ['id', 'label', 'type', 'timeline_start'];
    const missing = requiredFields.filter(field => !req.body[field]);
    
    if (missing.length > 0) {
      return res.status(400).json({
        error: `缺少必要字段: ${missing.join(', ')}`
      });
    }
    
    next();
  };
  
  module.exports = { validateNode };