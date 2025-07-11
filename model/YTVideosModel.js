const mongoose = require("mongoose");

const VideoSchema = new mongoose.Schema({
    subject: String,
    topic: String,
    title: String,
    description: String,
    url: String,
    tags: [String],
    addedBy: String,
    youTubeRaw: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'YouTubeMeta'
    }
});


module.exports = mongoose.model("Video", VideoSchema);
