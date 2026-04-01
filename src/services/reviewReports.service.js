const { getDB } = require('../db/database');

/**
 * Create Report
 */
const createReport = async (data) => {
    const db = getDB();

    const [result] = await db.execute(
        `
        INSERT INTO review_reports 
        (review_id, user_id, reason, description, created_by)
        VALUES (?, ?, ?, ?, ?)
        `,
        [
            data.review_id,
            data.user_id,
            data.reason,
            data.description || null,
            data.created_by || null
        ]
    );

    return result.insertId;
};

/**
 * Get All Reports
 */
const getReports = async () => {
    const db = getDB();

    const [rows] = await db.execute(
        `SELECT * FROM review_reports WHERE deleted_at IS NULL ORDER BY created_at DESC`
    );

    return rows;
};

/**
 * ✅ Get Reports by Review
 */
const getReportsByReview = async (review_id) => {
    const db = getDB();

    const [rows] = await db.execute(
        `
        SELECT * FROM review_reports
        WHERE review_id = ? AND deleted_at IS NULL
        ORDER BY created_at DESC
        `,
        [review_id]
    );

    return rows;
};

/**
 * ✅ Update Report
 */
const updateReport = async (id, data) => {
    const db = getDB();

    const [result] = await db.execute(
        `
        UPDATE review_reports
        SET reason = ?, description = ?, status = ?, updated_by = ?
        WHERE id = ? AND deleted_at IS NULL
        `,
        [
            data.reason,
            data.description || null,
            data.status || 'pending',
            data.updated_by || null,
            id
        ]
    );

    return result.affectedRows;
};

/**
 * ✅ Delete Report (Soft Delete)
 */
const deleteReport = async (id, deleted_by) => {
    const db = getDB();

    const [result] = await db.execute(
        `
        UPDATE review_reports
        SET deleted_at = NOW(), deleted_by = ?
        WHERE id = ? AND deleted_at IS NULL
        `,
        [deleted_by || null, id]
    );

    return result.affectedRows;
};

module.exports = {
    createReport,
    getReports,
    getReportsByReview,
    updateReport,
    deleteReport
};