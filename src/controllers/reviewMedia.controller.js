const service = require('../services/reviewMedia.service');

/**
 * Add Media
 */
exports.addMedia = async (req, res) => {
    try {
        const { review_id, file_url, file_type } = req.body;

        if (!review_id || !file_url) {
            return res.status(400).json({
                success: false,
                message: 'review_id and file_url required'
            });
        }

        const id = await service.addMedia({
            review_id,
            file_url,
            file_type,
            created_by: 1
        });

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
 * Get Media by Review
 */
exports.getMedia = async (req, res) => {
    try {
        const { review_id } = req.query;

        if (!review_id) {
            return res.status(400).json({
                success: false,
                message: 'review_id required'
            });
        }

        const data = await service.getMediaByReview(review_id);

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
 * Get All Media
 */
exports.getAllMedia = async (req, res) => {
    try {
        const data = await service.getAllMedia();

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
 * Update Media
 */
exports.updateMedia = async (req, res) => {
    try {
        const id = req.params.id;
        const { file_url, file_type } = req.body;

        if (!file_url) {
            return res.status(400).json({
                success: false,
                message: 'file_url required'
            });
        }

        const affected = await service.updateMedia(id, {
            file_url,
            file_type,
            updated_by: 1
        });

        if (!affected) {
            return res.status(404).json({
                success: false,
                message: 'Media not found'
            });
        }

        return res.json({
            success: true,
            message: 'Media updated'
        });

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

/**
 * Delete Media
 */
exports.deleteMedia = async (req, res) => {
    try {
        const id = req.params.id;

        const affected = await service.deleteMedia(id, 1);

        if (!affected) {
            return res.status(404).json({
                success: false,
                message: 'Media not found'
            });
        }

        return res.json({
            success: true,
            message: 'Media deleted'
        });

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
};