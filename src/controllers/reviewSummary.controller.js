const service = require('../services/reviewSummary.service');

/**
 * Get Single
 */
exports.getSummary = async (req, res) => {
    try {
        const { entity_id, entity_type } = req.query;

        const data = await service.getSummary(entity_id, entity_type);

        res.json({ success: true, data });

    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

/**
 * Get All
 */
exports.getAllSummaries = async (req, res) => {
    try {
        const data = await service.getAllSummaries();

        res.json({ success: true, count: data.length, data });

    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

/**
 * ✅ Update
 */
exports.updateSummary = async (req, res) => {
    try {
        const id = req.params.id;

        const affected = await service.updateSummary(id, {
            ...req.body,
            updated_by: 1
        });

        if (!affected) {
            return res.status(404).json({ success: false, message: 'Not found' });
        }

        res.json({ success: true, message: 'Updated' });

    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

/**
 * ✅ Delete
 */
exports.deleteSummary = async (req, res) => {
    try {
        const id = req.params.id;

        const affected = await service.deleteSummary(id, 1);

        if (!affected) {
            return res.status(404).json({ success: false, message: 'Not found' });
        }

        res.json({ success: true, message: 'Deleted' });

    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};