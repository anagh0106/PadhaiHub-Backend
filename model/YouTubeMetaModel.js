const mongoose = require("mongoose");

const YouTubeMetaSchema = new mongoose.Schema({
    videoId: {
        type: String,
        required: true,
        unique: true
    },
    title: {
        type: String,
        required: true
    },
    description: {
        type: String
    },
    tags: {
        type: [String],
        default: []
    },
    addedBy: {
        type: String
    },
}, {
    timestamps: true  // --> createdAt, updatedAt automatically generate hoga
});

module.exports = mongoose.model("YouTubeMeta", YouTubeMetaSchema);
