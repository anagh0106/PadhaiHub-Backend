const Video = require("../model/YTVideosModel");
const YouTubeRawVideo = require("../model/YouTubeRawVideoSchema");  // naya schema
const { fetchYouTubeData } = require("../services/youtubeService");
const YouTubeMeta = require("../model/YouTubeMetaModel");  // <-- YouTubeMeta model import kar

const extractVideoID = (url) => {
    try {
        const urlObj = new URL(url);
        if (urlObj.hostname === "youtu.be") {
            return urlObj.pathname.substring(1);
        } else {
            return urlObj.searchParams.get("v");
        }
    } catch (err) {
        throw new Error("Invalid YouTube URL");
    }
};
const fetchYoutubeMeta = async (req, res) => {
    const { url } = req.body;
    try {
        const videoId = extractVideoID(url);
        const videoData = await fetchYouTubeData(videoId);

        // Pehle check kar: agar ye videoId already hai to dobara na insert kare
        let existingMeta = await YouTubeMeta.findOne({ videoId });
        if (existingMeta) {
            return res.status(200).json({
                message: "Meta already exists",
                metaId: existingMeta._id,
                meta: existingMeta
            });
        }

        // Naya YouTubeMeta document banaye:
        const newMeta = new YouTubeMeta({
            videoId,
            title: videoData.title,
            description: videoData.description,
            tags: videoData.tags,
            addedBy: videoData.addedBy
        });

        await newMeta.save();

        return res.status(201).json({
            message: "Meta fetched and saved successfully",
            metaId: newMeta._id,
            meta: newMeta
        });
    } catch (err) {
        console.log(err);
        return res.status(400).json({ error: err.message });
    }
};

// Add Video (full save with subject, topic)
const addVideo = async (req, res) => {
    const { url, subject, topic } = req.body;

    try {
        const videoId = extractVideoID(url);
        const videoData = await fetchYouTubeData(videoId);

        // First save fetched raw data (if not exist)
        let youtubeRaw = await YouTubeRawVideo.findOne({ videoId });
        if (!youtubeRaw) {
            youtubeRaw = await YouTubeRawVideo.create({
                videoId,
                title: videoData.title,
                description: videoData.description,
                tags: videoData.tags,
                channelTitle: videoData.addedBy,
                publishedAt: videoData.publishedAt
            });
        }

        const video = await Video.create({
            subject,
            topic,
            url,
            videoId,
            youTubeRaw: youtubeRaw._id,
            addedBy: videoData.addedBy,
        });

        res.status(201).json({ message: "Video saved successfully", video });
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
};
// Get all videos with populated YouTube Data
const getAllVideos = async (req, res) => {
    try {
        // const videos = await Video.find().populate("youTubeRaw");
        const videos = await Video.find();
        console.log(videos);

        res.status(200).json({
            message: "Successfully Done !",
            videos: videos
        });
    } catch (error) {
        console.log("Error while fetching videos:", error);
        res.status(500).json({ message: "Something went wrong", error: error.message });
    }
};
// Get single video by ID
const getVideoById = async (req, res) => {
    try {
        const { id } = req.params;
        const video = await Video.findById(id).populate("youTubeRaw");
        if (!video) {
            return res.status(404).json({ message: "Video not found" });
        }
        res.status(200).json(video);
    } catch (error) {
        console.log("Error while fetching video:", error);
        res.status(500).json({ message: "Something went wrong", error: error.message });
    }
};
// Update video (only subject, topic allowed)
const updateVideo = async (req, res) => {
    try {
        const { id } = req.params;
        const updateFields = {
            subject: req.body.subject,
            topic: req.body.topic
        };
        const updatedVideo = await Video.findByIdAndUpdate(id, updateFields, { new: true });

        if (!updatedVideo) {
            return res.status(404).json({ message: "Video not found" });
        }
        res.status(200).json(updatedVideo);
    } catch (error) {
        console.log("Error while updating video:", error);
        res.status(500).json({ message: "Something went wrong", error: error.message });
    }
};
// Delete video
const deleteVideo = async (req, res) => {
    try {
        const { id } = req.params;
        const deletedVideo = await Video.findByIdAndDelete(id);
        if (!deletedVideo) {
            return res.status(404).json({ message: "Video not found" });
        }
        res.status(200).json({ message: "Video deleted successfully" });
    } catch (error) {
        console.log("Error while deleting video:", error);
        res.status(500).json({ message: "Something went wrong", error: error.message });
    }
};
// Filter by subject
const getVideosBySubject = async (req, res) => {
    try {
        const { subject } = req.params;
        const videos = await Video.find({ subject }).populate("youTubeRaw");
        res.status(200).json(videos);
    } catch (error) {
        console.log("Error while fetching videos by subject:", error);
        res.status(500).json({ message: "Something went wrong", error: error.message });
    }
};

module.exports = {
    getAllVideos,
    getVideoById,
    updateVideo,
    deleteVideo,
    getVideosBySubject,
    addVideo,
    fetchYoutubeMeta
};
