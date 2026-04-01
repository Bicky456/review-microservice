const { getDB } = require('../db/database');

/**
 * Add Moderation Log
 */
const addLog = async (data) => {
    const db = getDB();

    const [result] = await db.execute(
        `
        INSERT INTO review_moderation_logs 
        (review_id, action, remarks, created_by)
        VALUES (?, ?, ?, ?)
        `,
        [
            data.review_id,
            data.action,
            data.remarks || null,
            data.created_by || null
        ]
    );

    return result.insertId;
};

/**
 * Get Logs by Review
 */
const getLogs = async (review_id) => {
    const db = getDB();

    const [rows] = await db.execute(
        `
        SELECT * FROM review_moderation_logs
        WHERE review_id = ? AND deleted_at IS NULL
        ORDER BY created_at DESC
        `,
        [review_id]
    );

    return rows;
};

/**
 * ✅ Get All Logs
 */
const getAllLogs = async () => {
    const db = getDB();

    const [rows] = await db.execute(
        `
        SELECT * FROM review_moderation_logs
        WHERE deleted_at IS NULL
        ORDER BY created_at DESC
        `
    );

    return rows;
};

/**
 * ✅ Update Log
 */
const updateLog = async (id, data) => {
    const db = getDB();

    const [result] = await db.execute(
        `
        UPDATE review_moderation_logs
        SET action = ?, remarks = ?, updated_by = ?
        WHERE id = ? AND deleted_at IS NULL
        `,
        [
            data.action,
            data.remarks || null,
            data.updated_by || null,
            id
        ]
    );

    return result.affectedRows;
};

/**
 * ✅ Delete Log (Soft Delete)
 */
const deleteLog = async (id, deleted_by) => {
    const db = getDB();

    const [result] = await db.execute(
        `
        UPDATE review_moderation_logs
        SET deleted_at = NOW(), deleted_by = ?
        WHERE id = ? AND deleted_at IS NULL
        `,
        [deleted_by || null, id]
    );

    return result.affectedRows;
};

module.exports = {
    addLog,
    getLogs,
    getAllLogs,
    updateLog,
    deleteLog
};