
const express = require("express");
const router = express.Router();
const tiffinController = require("../controller/user/TiffinLike");


router.post("/tiffins/:id/like", tiffinController.toggleLike);

router.get("/tiffins/:id/isliked", tiffinController.checkIfLiked);
router.get("/tiffins/liked", tiffinController.getLikedTiffins);
module.exports = router;