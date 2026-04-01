const service = require('../services/reviewModeration.service');

/**
 * Add Log
 */
exports.addLog = async (req, res) => {
    try {
        const { review_id, action, remarks } = req.body;

        if (!review_id || !action) {
            return res.status(400).json({
                success: false,
                message: 'review_id and action required'
            });
        }

        const id = await service.addLog({
            review_id,
            action,
            remarks,
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
 * Get Logs by Review
 */
exports.getLogs = async (req, res) => {
    try {
        const { review_id } = req.query;

        if (!review_id) {
            return res.status(400).json({
                success: false,
                message: 'review_id required'
            });
        }

        const data = await service.getLogs(review_id);

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
 * ✅ Get All Logs
 */
exports.getAllLogs = async (req, res) => {
    try {
        const data = await service.getAllLogs();

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
 * ✅ Update Log
 */
exports.updateLog = async (req, res) => {
    try {
        const id = req.params.id;
        const { action, remarks } = req.body;

        if (!action) {
            return res.status(400).json({
                success: false,
                message: 'action required'
            });
        }

        const affected = await service.updateLog(id, {
            action,
            remarks,
            updated_by: 1
        });

        if (!affected) {
            return res.status(404).json({
                success: false,
                message: 'Log not found'
            });
        }

        return res.json({
            success: true,
            message: 'Log updated'
        });

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

/**
 * ✅ Delete Log
 */
exports.deleteLog = async (req, res) => {
    try {
        const id = req.params.id;

        const affected = await service.deleteLog(id, 1);

        if (!affected) {
            return res.status(404).json({
                success: false,
                message: 'Log not found'
            });
        }

        return res.json({
            success: true,
            message: 'Log deleted'
        });

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
};