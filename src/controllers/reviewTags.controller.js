const service = require('../services/reviewTags.service');

/**
 * Create Tag
 */
exports.createTag = async (req, res) => {
    try {
        const { name } = req.body;

        if (!name) {
            return res.status(400).json({
                success: false,
                message: 'name required'
            });
        }

        const id = await service.createTag(name, 1);

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
 * Get All Tags
 */
exports.getTags = async (req, res) => {
    try {
        const data = await service.getTags();

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
 * ✅ Update Tag
 */
exports.updateTag = async (req, res) => {
    try {
        const id = req.params.id;
        const { name } = req.body;

        if (!name) {
            return res.status(400).json({
                success: false,
                message: 'name required'
            });
        }

        const affected = await service.updateTag(id, name, 1);

        if (!affected) {
            return res.status(404).json({
                success: false,
                message: 'Tag not found'
            });
        }

        return res.json({
            success: true,
            message: 'Tag updated'
        });

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

/**
 * ✅ Delete Tag
 */
exports.deleteTag = async (req, res) => {
    try {
        const id = req.params.id;

        const affected = await service.deleteTag(id, 1);

        if (!affected) {
            return res.status(404).json({
                success: false,
                message: 'Tag not found'
            });
        }

        return res.json({
            success: true,
            message: 'Tag deleted'
        });

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
};