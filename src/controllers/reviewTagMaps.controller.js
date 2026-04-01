const service = require('../services/reviewTagMaps.service');

/**
 * Add Tag
 */
exports.addTag = async (req, res) => {
    try {
        const { review_id, tag_id } = req.body;

        if (!review_id || !tag_id) {
            return res.status(400).json({
                success: false,
                message: 'review_id and tag_id required'
            });
        }

        const id = await service.addTagToReview(review_id, tag_id, 1);

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
 * Get Tags by Review
 */
exports.getTags = async (req, res) => {
    try {
        const { review_id } = req.query;

        if (!review_id) {
            return res.status(400).json({
                success: false,
                message: 'review_id required'
            });
        }

        const data = await service.getTagsByReview(review_id);

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
 * Get ALL Mappings
 */
exports.getAllMappings = async (req, res) => {
    try {
        const data = await service.getAllMappings();

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
 * ✅ UPDATE Mapping
 */
exports.updateMapping = async (req, res) => {
    try {
        const id = req.params.id;
        const { tag_id } = req.body;

        if (!tag_id) {
            return res.status(400).json({
                success: false,
                message: 'tag_id required'
            });
        }

        const affected = await service.updateTagMapping(id, tag_id, 1);

        if (!affected) {
            return res.status(404).json({
                success: false,
                message: 'Mapping not found'
            });
        }

        return res.json({
            success: true,
            message: 'Tag mapping updated'
        });

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

/**
 * Delete Mapping
 */
exports.deleteMapping = async (req, res) => {
    try {
        const id = req.params.id;

        const affected = await service.deleteTagMapping(id, 1);

        if (!affected) {
            return res.status(404).json({
                success: false,
                message: 'Mapping not found'
            });
        }

        return res.json({
            success: true,
            message: 'Tag removed from review'
        });

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
};