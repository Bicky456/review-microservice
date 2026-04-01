const service = require('../services/reviewFlags.service');

/**
 * Add Flag
 */
exports.addFlag = async (req, res) => {
    try {
        const { review_id, flag_type } = req.body;

        if (!review_id || !flag_type) {
            return res.status(400).json({
                success: false,
                message: 'review_id and flag_type required'
            });
        }

        const id = await service.addFlag({
            review_id,
            flag_type,
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
 * Get Flags
 */
exports.getFlags = async (req, res) => {
    try {
        const { review_id } = req.query;

        if (!review_id) {
            return res.status(400).json({
                success: false,
                message: 'review_id required'
            });
        }

        const data = await service.getFlags(review_id);

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
 * Get All Flags
 */
exports.getAllFlags = async (req, res) => {
    try {
        const data = await service.getAllFlags();

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
 * Update Flag
 */
exports.updateFlag = async (req, res) => {
    try {
        const id = req.params.id;
        const { flag_type } = req.body;

        if (!flag_type) {
            return res.status(400).json({
                success: false,
                message: 'flag_type required'
            });
        }

        const affected = await service.updateFlag(id, {
            flag_type,
            updated_by: 1
        });

        if (!affected) {
            return res.status(404).json({
                success: false,
                message: 'Flag not found'
            });
        }

        return res.json({
            success: true,
            message: 'Flag updated'
        });

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

/**
 * Delete Flag
 */
exports.deleteFlag = async (req, res) => {
    try {
        const id = req.params.id;

        const affected = await service.deleteFlag(id, 1);

        if (!affected) {
            return res.status(404).json({
                success: false,
                message: 'Flag not found'
            });
        }

        return res.json({
            success: true,
            message: 'Flag deleted'
        });

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
};