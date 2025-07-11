const multer = require("multer")
const path = require("path")

const storage = multer.diskStorage({
    destination: function (req, res, cb) {
        cb(null, "uploads/")
    },
    filename: function (req, file, cb) {
        const uniqueName = `profile-${Date.now()}${path.extname(file.originalname)}`
        cb(null, uniqueName)
    }
})

const upload = multer({ storage: storage })
module.exports = { upload }