const { getDB } = require('../db/database');

/**
 * Create Setting
 */
const createSetting = async (data) => {
    const db = getDB();

    const [result] = await db.execute(
        `
        INSERT INTO review_settings 
        (entity_type, allow_anonymous, auto_approve, allow_media, created_by)
        VALUES (?, ?, ?, ?, ?)
        `,
        [
            data.entity_type,
            data.allow_anonymous ?? true,
            data.auto_approve ?? false,
            data.allow_media ?? true,
            data.created_by || null
        ]
    );

    return result.insertId;
};

/**
 * Get All Settings
 */
const getSettings = async () => {
    const db = getDB();

    const [rows] = await db.execute(
        `SELECT * FROM review_settings WHERE deleted_at IS NULL`
    );

    return rows;
};

/**
 * Get Setting by Entity Type
 */
const getSettingByType = async (entity_type) => {
    const db = getDB();

    const [rows] = await db.execute(
        `
        SELECT * FROM review_settings
        WHERE entity_type = ? AND deleted_at IS NULL
        LIMIT 1
        `,
        [entity_type]
    );

    return rows[0] || null;
};

/**
 * Update Setting
 */
const updateSetting = async (entity_type, data) => {
    const db = getDB();

    const [result] = await db.execute(
        `
        UPDATE review_settings SET
            allow_anonymous = ?,
            auto_approve = ?,
            allow_media = ?,
            updated_by = ?
        WHERE entity_type = ? AND deleted_at IS NULL
        `,
        [
            data.allow_anonymous,
            data.auto_approve,
            data.allow_media,
            data.updated_by || null,
            entity_type
        ]
    );

    return result.affectedRows;
};

module.exports = {
    createSetting,
    getSettings,
    getSettingByType,
    updateSetting
};