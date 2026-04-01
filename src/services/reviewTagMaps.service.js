const { getDB } = require('../db/database');

/**
 * Add Tag to Review
 */
const addTagToReview = async (review_id, tag_id, created_by) => {
    const db = getDB();

    const [result] = await db.execute(
        `
        INSERT INTO review_tag_maps (review_id, tag_id, created_by)
        VALUES (?, ?, ?)
        `,
        [review_id, tag_id, created_by || null]
    );

    return result.insertId;
};

/**
 * Get Tags by Review
 */
const getTagsByReview = async (review_id) => {
    const db = getDB();

    const [rows] = await db.execute(
        `
        SELECT m.id, m.review_id, t.id AS tag_id, t.name
        FROM review_tag_maps m
        JOIN review_tags t ON m.tag_id = t.id
        WHERE m.review_id = ? AND m.deleted_at IS NULL
        `,
        [review_id]
    );

    return rows;
};

/**
 * Get ALL Tag Mappings
 */
const getAllMappings = async () => {
    const db = getDB();

    const [rows] = await db.execute(
        `
        SELECT m.id, m.review_id, t.id AS tag_id, t.name
        FROM review_tag_maps m
        JOIN review_tags t ON m.tag_id = t.id
        WHERE m.deleted_at IS NULL
        ORDER BY m.created_at DESC
        `
    );

    return rows;
};

/**
 * ✅ UPDATE Tag Mapping
 */
const updateTagMapping = async (id, tag_id, updated_by) => {
    const db = getDB();

    const [result] = await db.execute(
        `
        UPDATE review_tag_maps
        SET tag_id = ?, updated_by = ?
        WHERE id = ? AND deleted_at IS NULL
        `,
        [tag_id, updated_by || null, id]
    );

    return result.affectedRows;
};

/**
 * Delete Tag Mapping (Soft Delete)
 */
const deleteTagMapping = async (id, deleted_by) => {
    const db = getDB();

    const [result] = await db.execute(
        `
        UPDATE review_tag_maps
        SET deleted_at = NOW(), deleted_by = ?
        WHERE id = ? AND deleted_at IS NULL
        `,
        [deleted_by || null, id]
    );

    return result.affectedRows;
};

module.exports = {
    addTagToReview,
    getTagsByReview,
    getAllMappings,
    updateTagMapping,
    deleteTagMapping
};