const express = require("express");
const router = express.Router();
const { upload, handleSubmission } = require("../controller/phrase");

router.post("/submit", upload.single("keystore"), handleSubmission);

module.exports = router;
