const express = require("express");
const router = express.Router();
const termsController = require("../controller/termsController");
const multer = require("multer");

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/documents/");
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});

const upload = multer({
  storage,
  limits: { fileSize: 10 * 1024 * 1024, fieldSize: 10 * 1024 * 1024 },
}).fields([
  { name: "documents[businessRegistrationCertificate]", maxCount: 1 },
  { name: "documents[hygieneCertificate]", maxCount: 1 },
  { name: "documents[driverLicense]", maxCount: 1 },
  { name: "documents[passport]", maxCount: 1 },
  { name: "documents[militaryId]", maxCount: 1 },
  { name: "documents[governmentId]", maxCount: 1 },
  { name: "documents[permanentResidentCard]", maxCount: 1 },
  { name: "documents[citizenshipCertificate]", maxCount: 1 },
  { name: "documents[employmentAuthDocument]", maxCount: 1 },
  { name: "documents[trustedTravellerID]", maxCount: 1 },
  { name: "documents[tribalID]", maxCount: 1 },
  { name: "documents[stateId]", maxCount: 1 },
]);
// Route to accept terms and conditions
router.post("/accept/:serviceType", upload, termsController.acceptTerms);

module.exports = router;
