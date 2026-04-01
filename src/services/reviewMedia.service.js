const { getDB } = require('../db/database');
const logger = require('../utils/logger');

/**
 * Add Media
 */
const addMedia = async (data) => {
    try {
        const db = getDB();

        const { review_id, file_url, file_type, created_by } = data;

        const [result] = await db.execute(
            `
            INSERT INTO review_media (review_id, file_url, file_type, created_by)
            VALUES (?, ?, ?, ?)
            `,
            [review_id, file_url, file_type || null, created_by || null]
        );

        return result.insertId;

    } catch (error) {
        logger.error('Add Media Error', error);
        throw error;
    }
};

/**
 * Get Media by Review
 */
const getMediaByReview = async (review_id) => {
    try {
        const db = getDB();

        const [rows] = await db.execute(
            `
            SELECT * FROM review_media
            WHERE review_id = ? AND deleted_at IS NULL
            ORDER BY created_at ASC
            `,
            [review_id]
        );

        return rows;

    } catch (error) {
        logger.error('Get Media Error', error);
        throw error;
    }
};

/**
 * Get All Media
 */
const getAllMedia = async () => {
    try {
        const db = getDB();

        const [rows] = await db.execute(
            `
            SELECT * FROM review_media
            WHERE deleted_at IS NULL
            ORDER BY created_at DESC
            `
        );

        return rows;

    } catch (error) {
        logger.error('Get All Media Error', error);
        throw error;
    }
};

/**
 * Update Media
 */
const updateMedia = async (id, data) => {
    try {
        const db = getDB();

        const [result] = await db.execute(
            `
            UPDATE review_media
            SET file_url = ?, file_type = ?, updated_by = ?
            WHERE id = ? AND deleted_at IS NULL
            `,
            [
                data.file_url,
                data.file_type || null,
                data.updated_by || null,
                id
            ]
        );

        return result.affectedRows;

    } catch (error) {
        logger.error('Update Media Error', error);
        throw error;
    }
};

/**
 * Delete Media (Soft Delete)
 */
const deleteMedia = async (id, deleted_by) => {
    try {
        const db = getDB();

        const [result] = await db.execute(
            `
            UPDATE review_media
            SET deleted_at = NOW(), deleted_by = ?
            WHERE id = ? AND deleted_at IS NULL
            `,
            [deleted_by || null, id]
        );

        return result.affectedRows;

    } catch (error) {
        logger.error('Delete Media Error', error);
        throw error;
    }
};

module.exports = {
    addMedia,
    getMediaByReview,
    getAllMedia,
    updateMedia,
    deleteMedia
};