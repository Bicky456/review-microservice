const express = require('express');
const router = express.Router();

const reviewController = require('../controllers/review.controller');

// DEBUG (remove later)
console.log('Review Controller:', reviewController);

// ✅ Create
router.post('/', reviewController.createReview);

// ✅ View Count (IMPORTANT: place before /:id)
router.post('/:id/view', reviewController.incrementReviewView);

// ✅ Get list
router.get('/', reviewController.getReviews);

// ✅ Count
router.get('/count', reviewController.getReviewCountByType);

// ✅ Search
router.get('/search', reviewController.searchReviews);

// ✅ Get single review
router.get('/:id', reviewController.getReviewById);

// ✅ Update
router.put('/:id', reviewController.updateReview);

// ✅ Delete
router.delete('/:id', reviewController.deleteReview);

router.put('/:id/restore', reviewController.restoreReview);

module.exports = router;