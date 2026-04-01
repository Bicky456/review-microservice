const express = require('express');
const router = express.Router();

const controller = require('../controllers/reviewModeration.controller');

// 🔥 IMPORTANT ORDER
router.get('/all', controller.getAllLogs);   // get all
router.get('/', controller.getLogs);         // by review_id

router.post('/', controller.addLog);
router.put('/:id', controller.updateLog);
router.delete('/:id', controller.deleteLog);

module.exports = router;