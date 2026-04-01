const express = require('express');
const router = express.Router();

const controller = require('../controllers/reviewReports.controller');

// 🔥 IMPORTANT ORDER
router.get('/by-review', controller.getReportsByReview);
router.get('/', controller.getReports);

router.post('/', controller.createReport);
router.put('/:id', controller.updateReport);
router.delete('/:id', controller.deleteReport);

module.exports = router;