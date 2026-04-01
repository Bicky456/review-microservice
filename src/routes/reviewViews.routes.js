const express = require('express');
const router = express.Router();

const controller = require('../controllers/reviewViews.controller');

// 🔥 ORDER IMPORTANT
router.get('/all', controller.getAllViews);   // GET ALL
router.get('/', controller.getViews);         // by review

router.post('/', controller.addView);
router.put('/:id', controller.updateView);   // UPDATE
router.delete('/:id', controller.deleteView); // DELETE

module.exports = router;