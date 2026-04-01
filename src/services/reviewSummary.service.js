const { getDB } = require('../db/database');
const logger = require('../utils/logger');

/**
 * Get Single Summary
 */
const getSummary = async (entity_id, entity_type) => {
    const db = getDB();

    const [rows] = await db.execute(
        `SELECT * FROM review_summary WHERE entity_id = ? AND entity_type = ?`,
        [entity_id, entity_type]
    );

    return rows[0] || null;
};

/**
 * Get All Summaries
 */
const getAllSummaries = async () => {
    const db = getDB();

    const [rows] = await db.execute(
        `SELECT * FROM review_summary WHERE deleted_at IS NULL ORDER BY created_at DESC`
    );

    return rows;
};

/**
 * ✅ Manual Update Summary
 */
const updateSummary = async (id, data) => {
    const db = getDB();

    const [result] = await db.execute(
        `
        UPDATE review_summary SET
            total_reviews = ?,
            avg_rating = ?,
            rating_1 = ?,
            rating_2 = ?,
            rating_3 = ?,
            rating_4 = ?,
            rating_5 = ?,
            updated_by = ?
        WHERE id = ? AND deleted_at IS NULL
        `,
        [
            data.total_reviews,
            data.avg_rating,
            data.rating_1,
            data.rating_2,
            data.rating_3,
            data.rating_4,
            data.rating_5,
            data.updated_by || null,
            id
        ]
    );

    return result.affectedRows;
};

/**
 * ✅ Delete Summary (Soft Delete)
 */
const deleteSummary = async (id, deleted_by) => {
    const db = getDB();

    const [result] = await db.execute(
        `
        UPDATE review_summary
        SET deleted_at = NOW(), deleted_by = ?
        WHERE id = ? AND deleted_at IS NULL
        `,
        [deleted_by || null, id]
    );

    return result.affectedRows;
};

/**
 * Auto Update Summary (existing logic)
 */
const updateReviewSummary = async (entity_id, entity_type) => {
    try {
        const db = getDB();

        const [rows] = await db.execute(
            `
            SELECT 
                COUNT(*) as total_reviews,
                AVG(rating) as avg_rating,

                SUM(rating >= 4.5) as rating_5,
                SUM(rating >= 3.5 AND rating < 4.5) as rating_4,
                SUM(rating >= 2.5 AND rating < 3.5) as rating_3,
                SUM(rating >= 1.5 AND rating < 2.5) as rating_2,
                SUM(rating < 1.5) as rating_1
            FROM reviews
            WHERE entity_id = ?
              AND entity_type = ?
              AND deleted_at IS NULL
              AND status = 'approved'
            `,
            [entity_id, entity_type]
        );

        const s = rows[0];

        await db.execute(
            `
            INSERT INTO review_summary (
                entity_id, entity_type,
                total_reviews, avg_rating,
                rating_1, rating_2, rating_3, rating_4, rating_5,
                created_by
            )
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
            ON DUPLICATE KEY UPDATE
                total_reviews = VALUES(total_reviews),
                avg_rating = VALUES(avg_rating),
                rating_1 = VALUES(rating_1),
                rating_2 = VALUES(rating_2),
                rating_3 = VALUES(rating_3),
                rating_4 = VALUES(rating_4),
                rating_5 = VALUES(rating_5)
            `,
            [
                entity_id,
                entity_type,
                s.total_reviews || 0,
                s.avg_rating || 0,
                s.rating_1 || 0,
                s.rating_2 || 0,
                s.rating_3 || 0,
                s.rating_4 || 0,
                s.rating_5 || 0,
                1
            ]
        );

        logger.info('Summary updated', { entity_id, entity_type });

    } catch (error) {
        logger.error('Summary Error', error);
        throw error;
    }
};

module.exports = {
    getSummary,
    getAllSummaries,
    updateSummary,
    deleteSummary,
    updateReviewSummary
};