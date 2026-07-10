const express = require('express');
const { getAllBanners, getActiveBanners, createBanner, updateBanner, deleteBanner, clickCounts, getClicksByTimeframe } = require('../../controller/marketing-dashboard/bannerController');
// const upload = require('../../config/multerConfig');

const { upload } = require("../../config/cloudinary")

const router = express.Router();

router.get('/', getAllBanners);
router.post('/', createBanner);

router.post('/banner-click/:_id', clickCounts)   // add a new click entry with current date
router.get('/:id/clicks', getClicksByTimeframe)

router.get('/active', getActiveBanners);

router.put('/:id', upload.any(), updateBanner);
router.delete('/:id', deleteBanner);

module.exports = router;
