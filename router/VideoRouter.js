const express = require("express");
const router = express.Router();
const videoController = require("../controller/VideoController");

router.post('/fetch-meta', videoController.fetchYoutubeMeta);
router.post("/add-video", videoController.addVideo);
router.get('/by-subject/:subject', videoController.getVideosBySubject);
router.get('/all', videoController.getAllVideos);
router.get('/:id', videoController.getVideoById);
router.put('/:id', videoController.updateVideo);
router.delete('/:id', videoController.deleteVideo);

module.exports = router;
