const { getDB } = require('../db/database');

/**
 * Create Tag
 */
const createTag = async (name, created_by) => {
    const db = getDB();

    const [result] = await db.execute(
        `INSERT INTO review_tags (name, created_by) VALUES (?, ?)`,
        [name, created_by || null]
    );

    return result.insertId;
};

/**
 * Get All Tags
 */
const getTags = async () => {
    const db = getDB();

    const [rows] = await db.execute(
        `SELECT * FROM review_tags WHERE deleted_at IS NULL ORDER BY created_at DESC`
    );

    return rows;
};

/**
 * ✅ Update Tag
 */
const updateTag = async (id, name, updated_by) => {
    const db = getDB();

    const [result] = await db.execute(
        `
        UPDATE review_tags
        SET name = ?, updated_by = ?
        WHERE id = ? AND deleted_at IS NULL
        `,
        [name, updated_by || null, id]
    );

    return result.affectedRows;
};

/**
 * ✅ Delete Tag (Soft Delete)
 */
const deleteTag = async (id, deleted_by) => {
    const db = getDB();

    const [result] = await db.execute(
        `
        UPDATE review_tags
        SET deleted_at = NOW(), deleted_by = ?
        WHERE id = ? AND deleted_at IS NULL
        `,
        [deleted_by || null, id]
    );

    return result.affectedRows;
};

module.exports = {
    createTag,
    getTags,
    updateTag,
    deleteTag
};