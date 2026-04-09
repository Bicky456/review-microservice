require('dotenv').config({
    path: require('path').resolve(__dirname, '../.env')
});

const express = require('express');
const cors = require('cors');

const { initDatabase } = require('./db/database');
const logger = require('./utils/logger');

const reviewRoutes = require('./routes/review.routes');
const reviewSummaryRoutes = require('./routes/reviewSummary.routes');
const reviewVotesRoutes = require('./routes/reviewVotes.routes');
const reviewRepliesRoutes = require('./routes/reviewReplies.routes');
const reviewMediaRoutes = require('./routes/reviewMedia.routes');
const reviewTagsRoutes = require('./routes/reviewTags.routes');
const reviewTagMapsRoutes = require('./routes/reviewTagMaps.routes');
const reviewReportsRoutes = require('./routes/reviewReports.routes');
const reviewModerationRoutes = require('./routes/reviewModeration.routes');
const reviewViewsRoutes = require('./routes/reviewViews.routes');
const reviewFlagsRoutes = require('./routes/reviewFlags.routes');
const reviewSettingsRoutes = require('./routes/reviewSettings.routes');



const app = express();

app.use(cors());
app.use(express.json());

// Routes
app.use('/api/reviews', reviewRoutes);
app.use('/api/review-summary', reviewSummaryRoutes);
app.use('/api/review-votes', reviewVotesRoutes);
app.use('/api/review-replies', reviewRepliesRoutes);
app.use('/api/review-media', reviewMediaRoutes);
app.use('/api/review-tags', reviewTagsRoutes);
app.use('/api/review-tag-maps', reviewTagMapsRoutes);
app.use('/api/review-reports', reviewReportsRoutes);
app.use('/api/review-moderation', reviewModerationRoutes);
app.use('/api/review-views', reviewViewsRoutes);
app.use('/api/review-flags', reviewFlagsRoutes);
app.use('/api/review-settings',reviewSettingsRoutes);

// Health
app.get('/', (req, res) => {
    res.json({ success: true, message: 'Running 🚀' });
});

app.get('/health', (req, res) => {
    res.json({ status: 'OK', uptime: process.uptime() });
});

// Start
const startServer = async () => {
    await initDatabase();

    const PORT = process.env.PORT || 3000;

    app.listen(PORT, () => {
        logger.info(`Server running on ${PORT}`);
    });
};

startServer();