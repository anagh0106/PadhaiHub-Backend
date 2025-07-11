const express = require("express");
const { processContactRequest } = require("../controller/ContactusController");

const router = express.Router();

// POST route for contact form submission
router.post("/inquiry", processContactRequest);

module.exports = router;
