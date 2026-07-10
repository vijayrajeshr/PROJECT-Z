const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const multer = require('multer');

// 1. Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// 2. Create Storage Engine
const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'project-z-uploads',
    allowed_formats: ['jpg', 'png', 'jpeg', 'webp'], // Cloudinary's own validation
  },
});

// 3. Configure Multer (The Logic Layer)
const upload = multer({
  storage: storage,
  // A. LIMIT FILE SIZE (5 MB)
  limits: {
    fileSize: 5 * 1024 * 1024, // 5 MB in bytes
  },
  // B. FILTER FILE TYPES (Generate Error)
  fileFilter: (req, file, cb) => {
    // List of allowed mime types
    const allowedTypes = /jpeg|jpg|png|webp/;
    // Check extension and mime type
    const isMimeTypeValid = allowedTypes.test(file.mimetype);

    if (isMimeTypeValid) {
      cb(null, true); // Accept file
    } else {
      // Reject file with a specific error
      cb(new Error('Error: Only .jpeg, .jpg, .png, .webp formats allowed!'), false);
    }
  },
});

// Export 'upload' directly so routes can just use it
module.exports = { cloudinary, storage, upload };