const { getDB } = require('../db/database');

/**
 * Add Flag
 */
const addFlag = async (data) => {
    const db = getDB();

    const [result] = await db.execute(
        `
        INSERT INTO review_flags (review_id, flag_type, created_by)
        VALUES (?, ?, ?)
        `,
        [
            data.review_id,
            data.flag_type,
            data.created_by || null
        ]
    );

    return result.insertId;
};

/**
 * Get Flags by Review
 */
const getFlags = async (review_id) => {
    const db = getDB();

    const [rows] = await db.execute(
        `
        SELECT * FROM review_flags
        WHERE review_id = ? AND deleted_at IS NULL
        ORDER BY created_at DESC
        `,
        [review_id]
    );

    return rows;
};

/**
 * Get All Flags
 */
const getAllFlags = async () => {
    const db = getDB();

    const [rows] = await db.execute(
        `
        SELECT * FROM review_flags
        WHERE deleted_at IS NULL
        ORDER BY created_at DESC
        `
    );

    return rows;
};

/**
 * Update Flag
 */
const updateFlag = async (id, data) => {
    const db = getDB();

    const [result] = await db.execute(
        `
        UPDATE review_flags
        SET flag_type = ?, updated_by = ?
        WHERE id = ? AND deleted_at IS NULL
        `,
        [
            data.flag_type,
            data.updated_by || null,
            id
        ]
    );

    return result.affectedRows;
};

/**
 * Delete Flag (Soft Delete)
 */
const deleteFlag = async (id, deleted_by) => {
    const db = getDB();

    const [result] = await db.execute(
        `
        UPDATE review_flags
        SET deleted_at = NOW(), deleted_by = ?
        WHERE id = ? AND deleted_at IS NULL
        `,
        [
            deleted_by || null,
            id
        ]
    );

    return result.affectedRows;
};

module.exports = {
    addFlag,
    getFlags,
    updateFlag,
    deleteFlag,
    getAllFlags
};