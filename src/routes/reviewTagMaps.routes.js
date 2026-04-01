const express = require('express');
const router = express.Router();

const controller = require('../controllers/reviewTagMaps.controller');

// 🔥 ORDER IMPORTANT
router.get('/all', controller.getAllMappings);
router.get('/', controller.getTags);

router.post('/', controller.addTag);
router.put('/:id', controller.updateMapping);   // ✅ UPDATE
router.delete('/:id', controller.deleteMapping);

module.exports = router;