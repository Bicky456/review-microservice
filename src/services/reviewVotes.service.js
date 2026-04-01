const { getDB } = require('../db/database');
const logger = require('../utils/logger');

/**
 * Add / Toggle Vote (POST)
 */
const addOrUpdateVote = async (data) => {
    try {
        const db = getDB();
        const { review_id, user_id, vote } = data;

        const [[existing]] = await db.execute(
            `SELECT vote FROM review_votes WHERE review_id = ? AND user_id = ?`,
            [review_id, user_id]
        );

        if (!existing) {
            await db.execute(
                `INSERT INTO review_votes (review_id, user_id, vote)
                 VALUES (?, ?, ?)`,
                [review_id, user_id, vote]
            );

            await db.execute(
                `UPDATE reviews 
                 SET ${vote}_count = ${vote}_count + 1 
                 WHERE id = ?`,
                [review_id]
            );

            return { action: 'added' };
        }

        if (existing.vote === vote) {
            await db.execute(
                `DELETE FROM review_votes 
                 WHERE review_id = ? AND user_id = ?`,
                [review_id, user_id]
            );

            await db.execute(
                `UPDATE reviews 
                 SET ${vote}_count = ${vote}_count - 1 
                 WHERE id = ?`,
                [review_id]
            );

            return { action: 'removed' };
        }

        await db.execute(
            `UPDATE review_votes 
             SET vote = ? 
             WHERE review_id = ? AND user_id = ?`,
            [vote, review_id, user_id]
        );

        await db.execute(
            `UPDATE reviews 
             SET ${existing.vote}_count = ${existing.vote}_count - 1 
             WHERE id = ?`,
            [review_id]
        );

        await db.execute(
            `UPDATE reviews 
             SET ${vote}_count = ${vote}_count + 1 
             WHERE id = ?`,
            [review_id]
        );

        return { action: 'updated' };

    } catch (error) {
        logger.error('Vote Error', error);
        throw error;
    }
};

/**
 * ✅ Get ALL Votes
 */
const getAllVotes = async () => {
    const db = getDB();

    const [rows] = await db.execute(
        `SELECT * FROM review_votes ORDER BY created_at DESC`
    );

    return rows;
};

/**
 * ✅ Get Vote by ID
 */
const getVoteById = async (id) => {
    const db = getDB();

    const [rows] = await db.execute(
        `SELECT * FROM review_votes WHERE id = ?`,
        [id]
    );

    return rows[0] || null;
};

/**
 * ✅ Update Vote (PUT)
 */
const updateVote = async (id, vote, updated_by) => {
    const db = getDB();

    const [[existing]] = await db.execute(
        `SELECT review_id, vote FROM review_votes WHERE id = ?`,
        [id]
    );

    if (!existing) return 0;

    await db.execute(
        `UPDATE review_votes SET vote = ?, updated_by = ? WHERE id = ?`,
        [vote, updated_by || null, id]
    );

    // adjust counts
    await db.execute(
        `UPDATE reviews SET ${existing.vote}_count = ${existing.vote}_count - 1 WHERE id = ?`,
        [existing.review_id]
    );

    await db.execute(
        `UPDATE reviews SET ${vote}_count = ${vote}_count + 1 WHERE id = ?`,
        [existing.review_id]
    );

    return 1;
};

/**
 * ✅ Delete Vote
 */
const deleteVote = async (id) => {
    const db = getDB();

    const [[existing]] = await db.execute(
        `SELECT review_id, vote FROM review_votes WHERE id = ?`,
        [id]
    );

    if (!existing) return 0;

    await db.execute(
        `DELETE FROM review_votes WHERE id = ?`,
        [id]
    );

    await db.execute(
        `UPDATE reviews 
         SET ${existing.vote}_count = ${existing.vote}_count - 1 
         WHERE id = ?`,
        [existing.review_id]
    );

    return 1;
};

module.exports = {
    addOrUpdateVote,
    getAllVotes,
    getVoteById,
    updateVote,
    deleteVote
};