const express = require('express');
const router = express.Router();

const controller = require('../controllers/reviewMedia.controller');

// 🔥 IMPORTANT ORDER
router.get('/all', controller.getAllMedia);
router.get('/', controller.getMedia);

router.post('/', controller.addMedia);
router.put('/:id', controller.updateMedia);
router.delete('/:id', controller.deleteMedia);

module.exports = router;