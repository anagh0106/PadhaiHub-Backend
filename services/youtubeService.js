const { google } = require("googleapis");
require("dotenv").config();

const youtube = google.youtube({
    version: "v3",
    auth: process.env.YOUTUBE_API_KEY,
});

const fetchYouTubeData = async (videoId) => {
    const response = await youtube.videos.list({
        part: "snippet",
        id: videoId,
    });

    console.log("Raw response:", response.data);

    if (!response.data.items || response.data.items.length === 0) {
        throw new Error("Video not found or invalid videoId");
    }

    const snippet = response.data.items[0].snippet;

    return {
        title: snippet.title,
        description: snippet.description,
        tags: snippet.tags || [],
        addedBy: snippet.channelTitle,
    };
};


module.exports = { fetchYouTubeData };
