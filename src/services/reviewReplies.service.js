const { getDB } = require('../db/database');
const logger = require('../utils/logger');

/**
 * CREATE (reply_by + reply_to)
 */
const addReply = async (data) => {
    try {
        const db = getDB();

        let reply_to_user_id = null;
        let reply_to_user_name = null;

        // 🔥 Fetch parent user
        if (data.parent_id) {
            const [[parent]] = await db.execute(
                `SELECT user_id, user_name FROM review_replies WHERE id = ?`,
                [data.parent_id]
            );

            if (parent) {
                reply_to_user_id = parent.user_id;
                reply_to_user_name = parent.user_name;
            }
        }

        const user_name = data.user_name || `User_${data.user_id}`;

        const [result] = await db.execute(
            `
            INSERT INTO review_replies 
            (review_id, parent_id, user_id, user_name, comment, created_by)
            VALUES (?, ?, ?, ?, ?, ?)
            `,
            [
                data.review_id,
                data.parent_id || null,
                data.user_id,
                user_name,
                data.comment,
                data.created_by || null
            ]
        );

        return {
            id: result.insertId,
            reply_by: {
                user_id: data.user_id,
                user_name
            },
            reply_to: reply_to_user_id
                ? {
                      user_id: reply_to_user_id,
                      user_name: reply_to_user_name
                  }
                : null
        };

    } catch (error) {
        logger.error('Add Reply Error', error);
        throw error;
    }
};

/**
 * GET CHAT VIEW
 */
const getChatReplies = async (review_id) => {
    const db = getDB();

    const [rows] = await db.execute(
        `
        SELECT 
            r.id,
            r.review_id,
            r.user_id,
            r.user_name,
            r.comment,
            r.parent_id,
            r.created_at,

            p.user_id AS reply_to_user_id,
            p.user_name AS reply_to_user_name

        FROM review_replies r
        LEFT JOIN review_replies p ON r.parent_id = p.id

        WHERE r.review_id = ? AND r.deleted_at IS NULL
        ORDER BY r.created_at ASC
        `,
        [review_id]
    );

    return rows.map(r => ({
        id: r.id,
        comment: r.comment,
        parent_id: r.parent_id,
        created_at: r.created_at,

        reply_by: {
            user_id: r.user_id,
            user_name: r.user_name
        },

        reply_to: r.reply_to_user_id
            ? {
                  user_id: r.reply_to_user_id,
                  user_name: r.reply_to_user_name
              }
            : null
    }));
};

/**
 * BUILD TREE
 */
const buildTree = (rows) => {
    const map = {};
    const tree = [];

    rows.forEach(r => {
        map[r.id] = {
            id: r.id,
            comment: r.comment,
            parent_id: r.parent_id,
            created_at: r.created_at,

            reply_by: {
                user_id: r.user_id,
                user_name: r.user_name
            },

            reply_to: r.reply_to_user_id
                ? {
                      user_id: r.reply_to_user_id,
                      user_name: r.reply_to_user_name
                  }
                : null,

            children: []
        };
    });

    rows.forEach(r => {
        if (r.parent_id) {
            map[r.parent_id]?.children.push(map[r.id]);
        } else {
            tree.push(map[r.id]);
        }
    });

    return tree;
};

/**
 * GET THREAD VIEW
 */
const getThreadReplies = async (review_id) => {
    const db = getDB();

    const [rows] = await db.execute(
        `
        SELECT 
            r.id,
            r.user_id,
            r.user_name,
            r.comment,
            r.parent_id,
            r.created_at,

            p.user_id AS reply_to_user_id,
            p.user_name AS reply_to_user_name

        FROM review_replies r
        LEFT JOIN review_replies p ON r.parent_id = p.id

        WHERE r.review_id = ? AND r.deleted_at IS NULL
        ORDER BY r.created_at ASC
        `,
        [review_id]
    );

    return buildTree(rows);
};

/**
 * GET ALL
 */
const getAllReplies = async () => {
    const db = getDB();

    const [rows] = await db.execute(
        `SELECT * FROM review_replies WHERE deleted_at IS NULL`
    );

    return rows;
};

/**
 * UPDATE
 */
const updateReply = async (id, data) => {
    const db = getDB();

    const [result] = await db.execute(
        `
        UPDATE review_replies
        SET comment = ?, updated_by = ?
        WHERE id = ? AND deleted_at IS NULL
        `,
        [data.comment, data.updated_by || null, id]
    );

    return result.affectedRows;
};

/**
 * DELETE
 */
const deleteReply = async (id, deleted_by) => {
    const db = getDB();

    const [result] = await db.execute(
        `
        UPDATE review_replies
        SET deleted_at = NOW(), deleted_by = ?
        WHERE id = ? AND deleted_at IS NULL
        `,
        [deleted_by || null, id]
    );

    return result.affectedRows;
};

module.exports = {
    addReply,
    getChatReplies,
    getThreadReplies,
    getAllReplies,
    updateReply,
    deleteReply
};