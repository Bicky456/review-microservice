const reviewService = require('../services/review.service');
const { v4: uuidv4 } = require('uuid');

/**
 * Create Review
 */
const createReview = async (req, res) => {
    try {
        const { user_id, user_name, entity_id, entity_type, rating } = req.body;

        if (!user_id || !entity_id || !entity_type || !rating) {
            return res.status(400).json({
                success: false,
                message: 'user_id, entity_id, entity_type, rating are required'
            });
        }

        const data = {
            ...req.body,
            uuid: uuidv4(),
            user_name: user_name || `User_${user_id}`,
            ip_address: req.ip,
            user_agent: req.headers['user-agent'],
            created_by: user_id
        };

        const id = await reviewService.createReview(data);

        res.status(201).json({
            success: true,
            id,
            user_name: data.user_name
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

/**
 * Get Reviews (pagination)
 */
const getReviews = async (req, res) => {
    try {
        const data = await reviewService.getReviews({
            page: parseInt(req.query.page) || 1,
            limit: parseInt(req.query.limit) || 10
        });

        res.json({
            success: true,
            ...data
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

/**
 * Get Single Review (NO view increment here)
 */
const getReviewById = async (req, res) => {
    try {
        const data = await reviewService.getReviewById(req.params.id);

        if (!data) {
            return res.status(404).json({
                success: false,
                message: 'Review not found'
            });
        }

        res.json({
            success: true,
            data
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

/**
 * 🔥 NEW: Increment View Count
 */
const incrementReviewView = async (req, res) => {
    try {
        const id = req.params.id;

        const affected = await reviewService.incrementReviewView(id);

        if (!affected) {
            return res.status(404).json({
                success: false,
                message: 'Review not found'
            });
        }

        return res.json({
            success: true,
            message: 'View count updated'
        });

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

/**
 * Update Review
 */
const updateReview = async (req, res) => {
    try {
        const affected = await reviewService.updateReview(req.params.id, {
            ...req.body,
            updated_by: 1
        });

        if (!affected) {
            return res.status(404).json({
                success: false,
                message: 'Review not found'
            });
        }

        res.json({
            success: true,
            affected
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

/**
 * Delete Review
 */
const deleteReview = async (req, res) => {
    try {
        const affected = await reviewService.deleteReview(req.params.id, 1);

        if (!affected) {
            return res.status(404).json({
                success: false,
                message: 'Review not found'
            });
        }

        res.json({
            success: true,
            affected
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

/**
 * Search + Filter Reviews
 */
const searchReviews = async (req, res) => {
    try {
        const filters = {
            entity_id: req.query.entity_id,
            entity_type: req.query.entity_type,
            rating: req.query.rating,
            search: req.query.search,
            tag_id: req.query.tag_id,
            sort: req.query.sort,
            page: req.query.page,
            limit: req.query.limit
        };

        const data = await reviewService.searchReviews(filters);

        return res.json({
            success: true,
            count: data.length,
            data
        });

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

/**
 * Get Review Count by Entity Type
 */
const getReviewCountByType = async (req, res) => {
    try {
        const { entity_type } = req.query;

        if (!entity_type) {
            return res.status(400).json({
                success: false,
                message: 'entity_type is required'
            });
        }

        const data = await reviewService.getReviewCountByType(entity_type);

        res.json({
            success: true,
            entity_type,
            total_reviews: data.total_reviews
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

/**
 * Restore Review
 */
const restoreReview = async (req, res) => {
    try {
        const affected = await reviewService.restoreReview(req.params.id);

        if (!affected) {
            return res.status(404).json({
                success: false,
                message: "Review not found or already active"
            });
        }

        res.json({
            success: true,
            message: "Review restored successfully"
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

module.exports = {
    createReview,
    getReviews,
    getReviewById,
    incrementReviewView, // ✅ NEW EXPORT
    updateReview,
    deleteReview,
    searchReviews,
    getReviewCountByType,
    restoreReview
};