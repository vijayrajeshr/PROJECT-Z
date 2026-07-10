const express = require("express");
const router = express.Router();
const firmController = require("../controllers/firm");
// const multer = require("multer");
const { upload } = require("../../config/cloudinary")

// const upload = multer({ dest: "/uploads" }); //limiit file size to 2mb

router.post("/add-res", upload.any(), firmController.addRes);
router.post("/:id/update-time", firmController.updateTime);

module.exports = router;
