const service = require('../services/reviewVotes.service');

/**
 * POST (toggle vote)
 */
exports.addVote = async (req, res) => {
    try {
        const { review_id, user_id, vote } = req.body;

        const result = await service.addOrUpdateVote({
            review_id,
            user_id,
            vote
        });

        res.json({ success: true, ...result });

    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

/**
 * GET ALL
 */
exports.getAllVotes = async (req, res) => {
    const data = await service.getAllVotes();
    res.json({ success: true, count: data.length, data });
};

/**
 * GET BY ID
 */
exports.getVoteById = async (req, res) => {
    const data = await service.getVoteById(req.params.id);

    if (!data) {
        return res.status(404).json({ success: false, message: 'Not found' });
    }

    res.json({ success: true, data });
};

/**
 * PUT
 */
exports.updateVote = async (req, res) => {
    const affected = await service.updateVote(
        req.params.id,
        req.body.vote,
        1
    );

    if (!affected) {
        return res.status(404).json({ success: false });
    }

    res.json({ success: true, message: 'Updated' });
};

/**
 * DELETE
 */
exports.deleteVote = async (req, res) => {
    const affected = await service.deleteVote(req.params.id);

    if (!affected) {
        return res.status(404).json({ success: false });
    }

    res.json({ success: true, message: 'Deleted' });
};