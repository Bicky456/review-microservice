const express = require('express');
const router = express.Router();

const controller = require('../controllers/reviewTags.controller');

// GET ALL
router.get('/', controller.getTags);

// CREATE
router.post('/', controller.createTag);

// UPDATE
router.put('/:id', controller.updateTag);

// DELETE
router.delete('/:id', controller.deleteTag);

module.exports = router;