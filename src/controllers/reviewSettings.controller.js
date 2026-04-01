const service = require('../services/reviewSettings.service');

/**
 * Create Setting
 */
exports.createSetting = async (req, res) => {
    try {
        const { entity_type, allow_anonymous, auto_approve, allow_media } = req.body;

        if (!entity_type) {
            return res.status(400).json({
                success: false,
                message: 'entity_type required'
            });
        }

        const id = await service.createSetting({
            entity_type,
            allow_anonymous,
            auto_approve,
            allow_media,
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
 * Get All Settings
 */
exports.getSettings = async (req, res) => {
    try {
        const data = await service.getSettings();

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
 * Get Setting by Type
 */
exports.getSettingByType = async (req, res) => {
    try {
        const { entity_type } = req.query;

        if (!entity_type) {
            return res.status(400).json({
                success: false,
                message: 'entity_type required'
            });
        }

        const data = await service.getSettingByType(entity_type);

        return res.json({
            success: true,
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
 * Update Setting
 */
exports.updateSetting = async (req, res) => {
    try {
        const entity_type = req.params.entity_type;

        const affected = await service.updateSetting(entity_type, {
            ...req.body,
            updated_by: 1
        });

        if (!affected) {
            return res.status(404).json({
                success: false,
                message: 'Setting not found'
            });
        }

        return res.json({
            success: true,
            message: 'Setting updated'
        });

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

/**
 * ✅ Delete Setting
 */
exports.deleteSetting = async (req, res) => {
    try {
        const entity_type = req.params.entity_type;

        const affected = await service.deleteSetting(entity_type, 1);

        if (!affected) {
            return res.status(404).json({
                success: false,
                message: 'Setting not found'
            });
        }

        return res.json({
            success: true,
            message: 'Setting deleted'
        });

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
};