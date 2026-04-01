const express = require('express');
const router = express.Router();

const controller = require('../controllers/reviewReplies.controller');

// CREATE
router.post('/', controller.addReply);

// READ
router.get('/chat', controller.getChat);
router.get('/thread', controller.getThread);
router.get('/:id', controller.getReplyById);

// UPDATE
router.put('/:id', controller.updateReply);

// DELETE
router.delete('/:id', controller.deleteReply);

// GET ALL
router.get('/', controller.getAllReplies);

module.exports = router;