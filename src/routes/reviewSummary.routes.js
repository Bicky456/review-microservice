const express = require('express');
const router = express.Router();

const controller = require('../controllers/reviewSummary.controller');

// 🔥 ORDER IMPORTANT
router.get('/all', controller.getAllSummaries);
router.get('/', controller.getSummary);

router.put('/:id', controller.updateSummary);     // ✅ UPDATE
router.delete('/:id', controller.deleteSummary); // ✅ DELETE

module.exports = router;