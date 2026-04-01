const express = require('express');
const router = express.Router();

const controller = require('../controllers/reviewFlags.controller');

router.get('/all', controller.getAllFlags);
router.post('/', controller.addFlag);
router.get('/', controller.getFlags);
router.put('/:id', controller.updateFlag);
router.delete('/:id', controller.deleteFlag);

module.exports = router;