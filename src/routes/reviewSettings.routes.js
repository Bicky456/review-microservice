const express = require('express');
const router = express.Router();

const controller = require('../controllers/reviewSettings.controller');

// GET
router.get('/', controller.getSettings);
router.get('/by-type', controller.getSettingByType);

// CREATE
router.post('/', controller.createSetting);

// UPDATE
router.put('/:entity_type', controller.updateSetting);

// ✅ DELETE
router.delete('/:entity_type', controller.deleteSetting);

module.exports = router;