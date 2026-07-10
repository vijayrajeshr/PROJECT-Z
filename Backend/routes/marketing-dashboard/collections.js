const express = require("express");
const {
  getAllCollections,
  getActiveCollections,
  createCollection,
  updateCollection,
  deleteCollection,
  deleteCollectionsBulk,
  clickCounts,
  getClicksByTimeframe,
  getCollectionBySlug,
  toggleCollectionLike,
  getLikedCollections,
} = require("../../controller/marketing-dashboard/collectionController");
// const upload = require("../../config/multerConfig");  

const { upload } = require("../../config/cloudinary")

const router = express.Router();

router.get("/", getAllCollections);
router.post("/", upload.any(), createCollection); // Add upload middleware here
router.post("/bulk-delete", deleteCollectionsBulk);
router.get("/like", getLikedCollections);
router.post("/:id/like", toggleCollectionLike);
router.post("/collection-click/:_id", clickCounts); // add a new click entry with current date
router.get("/:id/clicks", getClicksByTimeframe);

router.get("/active", getActiveCollections);
router.get("/by-slug/:slug", getCollectionBySlug); // Add this new route

router.put("/:id", upload.any(), updateCollection);
router.delete("/:id", deleteCollection);

router.use((err, req, res, next) => {
  if (err instanceof multer.MulterError) {
    if (err.code === 'LIMIT_FILE_SIZE') {
      return res.status(400).json({ message: "File too large! Max limit is 5MB." });
    }
  } else if (err) {
    return res.status(400).json({ message: err.message });
  }
  next();
});


module.exports = router;
