const { Router } = require("express");
const router = Router();
const productController = require("../controllers/product");
const multer = require("multer");
const { upload } = require("../../config/cloudinary");

router.post(
  "/:id/add-product",
  upload.array("images", 5),
  productController.addProduct
);

router.get("/:id/all-products", productController.getAllProduct);

module.exports = router;
