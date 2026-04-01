const express = require('express');
const router = express.Router();

const controller = require('../controllers/reviewVotes.controller');

// GET
router.get('/', controller.getAllVotes);
router.get('/:id', controller.getVoteById);

// POST
router.post('/', controller.addVote);

// PUT
router.put('/:id', controller.updateVote);

// DELETE
router.delete('/:id', controller.deleteVote);

module.exports = router;