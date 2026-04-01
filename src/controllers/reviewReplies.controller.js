const service = require('../services/reviewReplies.service');

/**
 * CREATE
 */
const addReply = async (req, res) => {
    try {
        const { review_id, user_id, user_name, comment, parent_id } = req.body;

        if (!review_id || !user_id || !comment) {
            return res.status(400).json({
                success: false,
                message: 'review_id, user_id, comment required'
            });
        }

        const result = await service.addReply({
            review_id,
            user_id,
            user_name,
            comment,
            parent_id,
            created_by: user_id
        });

        res.status(201).json({
            success: true,
            ...result
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

/**
 * GET BY ID ✅ FIXED (THIS WAS MISSING)
 */
const getReplyById = async (req, res) => {
    try {
        const data = await service.getReplyById(req.params.id);

        if (!data) {
            return res.status(404).json({
                success: false,
                message: 'Reply not found'
            });
        }

        res.json({
            success: true,
            data
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

/**
 * CHAT (Flat)
 */
const getChat = async (req, res) => {
    try {
        const { review_id } = req.query;

        if (!review_id) {
            return res.status(400).json({
                success: false,
                message: 'review_id required'
            });
        }

        const data = await service.getChatReplies(review_id);

        res.json({
            success: true,
            type: 'chat',
            count: data.length,
            data
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

/**
 * THREAD (Tree)
 */
const getThread = async (req, res) => {
    try {
        const { review_id } = req.query;

        if (!review_id) {
            return res.status(400).json({
                success: false,
                message: 'review_id required'
            });
        }

        const data = await service.getThreadReplies(review_id);

        res.json({
            success: true,
            type: 'tree',
            count: data.length,
            data
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

/**
 * GET ALL
 */
const getAllReplies = async (req, res) => {
    try {
        const data = await service.getAllReplies();

        res.json({
            success: true,
            count: data.length,
            data
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

/**
 * UPDATE
 */
const updateReply = async (req, res) => {
    try {
        const affected = await service.updateReply(req.params.id, {
            comment: req.body.comment,
            updated_by: 1
        });

        if (!affected) {
            return res.status(404).json({
                success: false,
                message: 'Reply not found'
            });
        }

        res.json({
            success: true,
            affected
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

/**
 * DELETE
 */
const deleteReply = async (req, res) => {
    try {
        const affected = await service.deleteReply(req.params.id, 1);

        if (!affected) {
            return res.status(404).json({
                success: false,
                message: 'Reply not found'
            });
        }

        res.json({
            success: true,
            affected
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

module.exports = {
    addReply,
    getReplyById,   // ✅ THIS FIXES YOUR ERROR
    getChat,
    getThread,
    getAllReplies,
    updateReply,
    deleteReply
};