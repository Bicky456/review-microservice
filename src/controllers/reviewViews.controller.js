const service = require('../services/reviewViews.service');

/**
 * Add View
 */
exports.addView = async (req, res) => {
    try {
        const { review_id, user_id } = req.body;

        if (!review_id) {
            return res.status(400).json({
                success: false,
                message: 'review_id required'
            });
        }

        const id = await service.addView(review_id, user_id, 1);

        return res.status(201).json({
            success: true,
            id
        });

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

/**
 * Get Views by Review
 */
exports.getViews = async (req, res) => {
    try {
        const { review_id } = req.query;

        if (!review_id) {
            return res.status(400).json({
                success: false,
                message: 'review_id required'
            });
        }

        const data = await service.getViews(review_id);

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
 * ✅ Get ALL Views
 */
exports.getAllViews = async (req, res) => {
    try {
        const data = await service.getAllViews();

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
 * ✅ Update View
 */
exports.updateView = async (req, res) => {
    try {
        const id = req.params.id;
        const { user_id } = req.body;

        const affected = await service.updateView(id, {
            user_id,
            updated_by: 1
        });

        if (!affected) {
            return res.status(404).json({
                success: false,
                message: 'View not found'
            });
        }

        return res.json({
            success: true,
            message: 'View updated'
        });

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

/**
 * ✅ Delete View
 */
exports.deleteView = async (req, res) => {
    try {
        const id = req.params.id;

        const affected = await service.deleteView(id, 1);

        if (!affected) {
            return res.status(404).json({
                success: false,
                message: 'View not found'
            });
        }

        return res.json({
            success: true,
            message: 'View deleted'
        });

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
};