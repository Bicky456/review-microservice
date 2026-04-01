const { getDB } = require('../db/database');

/**
 * Add View
 */
const addView = async (review_id, user_id, created_by) => {
    const db = getDB();

    const [result] = await db.execute(
        `
        INSERT INTO review_views (review_id, user_id, created_by)
        VALUES (?, ?, ?)
        `,
        [
            review_id,
            user_id || null,
            created_by || null
        ]
    );

    return result.insertId;
};

/**
 * Get Views by Review
 */
const getViews = async (review_id) => {
    const db = getDB();

    const [rows] = await db.execute(
        `
        SELECT * FROM review_views
        WHERE review_id = ? AND deleted_at IS NULL
        ORDER BY created_at DESC
        `,
        [review_id]
    );

    return rows;
};

/**
 * ✅ Get ALL Views
 */
const getAllViews = async () => {
    const db = getDB();

    const [rows] = await db.execute(
        `
        SELECT * FROM review_views
        WHERE deleted_at IS NULL
        ORDER BY created_at DESC
        `
    );

    return rows;
};

/**
 * ✅ Get View by ID
 */
const getViewById = async (id) => {
    const db = getDB();

    const [rows] = await db.execute(
        `SELECT * FROM review_views WHERE id = ? AND deleted_at IS NULL`,
        [id]
    );

    return rows[0] || null;
};

/**
 * ✅ Update View
 */
const updateView = async (id, data) => {
    const db = getDB();

    const [result] = await db.execute(
        `
        UPDATE review_views
        SET user_id = ?, updated_by = ?
        WHERE id = ? AND deleted_at IS NULL
        `,
        [
            data.user_id || null,
            data.updated_by || null,
            id
        ]
    );

    return result.affectedRows;
};

/**
 * ✅ Delete View (Soft Delete)
 */
const deleteView = async (id, deleted_by) => {
    const db = getDB();

    const [result] = await db.execute(
        `
        UPDATE review_views
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
    addView,
    getViews,
    getAllViews,
    getViewById,
    updateView,
    deleteView
};