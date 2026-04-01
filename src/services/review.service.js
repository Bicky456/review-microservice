const { getDB } = require('../db/database');
const logger = require('../utils/logger');
const reviewSummaryService = require('./reviewSummary.service');

/**
 * Create Review
 */
const createReview = async (data) => {
    try {
        const db = getDB();

        const query = `
            INSERT INTO reviews (
                uuid, user_id, user_name, entity_id, entity_type,
                rating, title, comment,
                status, is_verified_purchase, is_anonymous,
                ip_address, user_agent, created_by,
                view_count
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `;

        const values = [
            data.uuid,
            data.user_id,
            data.user_name || `User_${data.user_id}`,
            data.entity_id,
            data.entity_type,
            data.rating,
            data.title || null,
            data.comment || null,
            data.status || 'approved',
            data.is_verified_purchase || false,
            data.is_anonymous || false,
            data.ip_address || null,
            data.user_agent || null,
            data.created_by || null,
            0 // ✅ default view count
        ];

        const [result] = await db.execute(query, values);

        await reviewSummaryService.updateReviewSummary(
            data.entity_id,
            data.entity_type
        );

        return result.insertId;

    } catch (error) {
        logger.error('Create Review DB Error', error);
        throw error;
    }
};

/**
 * Get Reviews (List)
 */
const getReviews = async ({ page = 1, limit = 10 }) => {
    const db = getDB();
    const offset = (page - 1) * limit;

    const [rows] = await db.execute(`
        SELECT * FROM reviews 
        WHERE deleted_at IS NULL
        ORDER BY created_at DESC
        LIMIT ${limit} OFFSET ${offset}
    `);

    const [[count]] = await db.execute(
        `SELECT COUNT(*) as total FROM reviews WHERE deleted_at IS NULL`
    );

    return { data: rows, total: count.total, page, limit };
};

/**
 * Get Review By ID (NO auto increment here)
 */
const getReviewById = async (id) => {
    const db = getDB();

    const [rows] = await db.execute(
        `SELECT * FROM reviews WHERE id = ? AND deleted_at IS NULL`,
        [id]
    );

    return rows[0];
};

/**
 * 🔥 Increment View Count (NEW)
 */
const incrementReviewView = async (id) => {
    try {
        const db = getDB();

        const [result] = await db.execute(
            `UPDATE reviews 
             SET view_count = view_count + 1 
             WHERE id = ? AND deleted_at IS NULL`,
            [id]
        );

        return result.affectedRows;

    } catch (error) {
        logger.error('Increment View Error', error);
        throw error;
    }
};

/**
 * Update Review
 */
const updateReview = async (id, data) => {
    const db = getDB();

    const [[existing]] = await db.execute(
        `SELECT entity_id, entity_type FROM reviews WHERE id = ?`,
        [id]
    );

    const query = `
        UPDATE reviews SET
            rating = ?,
            title = ?,
            comment = ?,
            status = ?,
            is_verified_purchase = ?,
            is_anonymous = ?,
            updated_by = ?
        WHERE id = ? AND deleted_at IS NULL
    `;

    const values = [
        data.rating ?? null,
        data.title ?? null,
        data.comment ?? null,
        data.status ?? null,
        data.is_verified_purchase ?? null,
        data.is_anonymous ?? null,
        data.updated_by ?? null,
        id
    ];

    const [result] = await db.execute(query, values);

    if (result.affectedRows && existing) {
        await reviewSummaryService.updateReviewSummary(
            existing.entity_id,
            existing.entity_type
        );
    }

    return result.affectedRows;
};

/**
 * Delete Review (Soft Delete)
 */
const deleteReview = async (id, deleted_by) => {
    const db = getDB();

    const [[existing]] = await db.execute(
        `SELECT entity_id, entity_type FROM reviews WHERE id = ?`,
        [id]
    );

    const [result] = await db.execute(
        `UPDATE reviews 
         SET deleted_at = NOW(), deleted_by = ?
         WHERE id = ? AND deleted_at IS NULL`,
        [deleted_by ?? null, id]
    );

    if (result.affectedRows && existing) {
        await reviewSummaryService.updateReviewSummary(
            existing.entity_id,
            existing.entity_type
        );
    }

    return result.affectedRows;
};

/**
 * Search Reviews
 */
const searchReviews = async (filters) => {
    const db = getDB();

    let query = `
        SELECT r.*
        FROM reviews r
        WHERE r.deleted_at IS NULL
        AND r.status = 'approved'
    `;

    const values = [];

    if (filters.entity_id) {
        query += ` AND r.entity_id = ?`;
        values.push(filters.entity_id);
    }

    if (filters.entity_type) {
        query += ` AND r.entity_type = ?`;
        values.push(filters.entity_type);
    }

    if (filters.rating) {
        query += ` AND FLOOR(r.rating) = ?`;
        values.push(filters.rating);
    }

    if (filters.search) {
        query += ` AND (r.title LIKE ? OR r.comment LIKE ?)`;
        values.push(`%${filters.search}%`, `%${filters.search}%`);
    }

    if (filters.tag_id) {
        query += `
            AND r.id IN (
                SELECT review_id FROM review_tag_maps WHERE tag_id = ?
            )
        `;
        values.push(filters.tag_id);
    }

    if (filters.sort === 'top') {
        query += ` ORDER BY r.like_count DESC`;
    } else if (filters.sort === 'most_viewed') {
        query += ` ORDER BY r.view_count DESC`; // ✅ NEW
    } else if (filters.sort === 'rating') {
        query += ` ORDER BY r.rating DESC`;
    } else {
        query += ` ORDER BY r.created_at DESC`;
    }

    const limit = parseInt(filters.limit) || 10;
    const page = parseInt(filters.page) || 1;
    const offset = (page - 1) * limit;

    query += ` LIMIT ${limit} OFFSET ${offset}`;

    const [rows] = await db.execute(query, values);

    return rows;
};

/**
 * Get Review Count by Entity Type
 */
const getReviewCountByType = async (entity_type) => {
    try {
        const db = getDB();

        const [[result]] = await db.execute(
            `
            SELECT COUNT(*) as total_reviews
            FROM reviews
            WHERE entity_type = ?
              AND deleted_at IS NULL
              AND status = 'approved'
            `,
            [entity_type]
        );

        return result;

    } catch (error) {
        logger.error('Get Review Count Error', error);
        throw error;
    }
};

module.exports = {
    createReview,
    getReviews,
    getReviewById,
    incrementReviewView, // ✅ NEW EXPORT
    updateReview,
    deleteReview,
    searchReviews,
    getReviewCountByType
};