const service = require('../services/reviewReports.service');

/**
 * Create Report
 */
exports.createReport = async (req, res) => {
    try {
        const { review_id, user_id, reason, description } = req.body;

        if (!review_id || !user_id || !reason) {
            return res.status(400).json({
                success: false,
                message: 'review_id, user_id, reason required'
            });
        }

        const id = await service.createReport({
            review_id,
            user_id,
            reason,
            description,
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
 * Get All Reports
 */
exports.getReports = async (req, res) => {
    try {
        const data = await service.getReports();

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
 * ✅ Get Reports by Review
 */
exports.getReportsByReview = async (req, res) => {
    try {
        const { review_id } = req.query;

        if (!review_id) {
            return res.status(400).json({
                success: false,
                message: 'review_id required'
            });
        }

        const data = await service.getReportsByReview(review_id);

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
 * ✅ Update Report
 */
exports.updateReport = async (req, res) => {
    try {
        const id = req.params.id;
        const { reason, description, status } = req.body;

        if (!reason) {
            return res.status(400).json({
                success: false,
                message: 'reason required'
            });
        }

        const affected = await service.updateReport(id, {
            reason,
            description,
            status,
            updated_by: 1
        });

        if (!affected) {
            return res.status(404).json({
                success: false,
                message: 'Report not found'
            });
        }

        return res.json({
            success: true,
            message: 'Report updated'
        });

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

/**
 * ✅ Delete Report
 */
exports.deleteReport = async (req, res) => {
    try {
        const id = req.params.id;

        const affected = await service.deleteReport(id, 1);

        if (!affected) {
            return res.status(404).json({
                success: false,
                message: 'Report not found'
            });
        }

        return res.json({
            success: true,
            message: 'Report deleted'
        });

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
};