const mongoose = require('mongoose');

const YouTubeRawVideoSchema = new mongoose.Schema({
    videoId: { type: String, required: true, unique: true },
    title: { type: String },
    description: { type: String },
    tags: [String],
    channelTitle: { type: String },
    publishedAt: { type: Date }
}, { timestamps: true });

module.exports = mongoose.model("YouTubeRawVideo", YouTubeRawVideoSchema);
