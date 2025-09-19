const express = require('express');
const router = express.Router();
const multer = require('multer');
const cloudinary = require('../config/cloudinary');
const { CloudinaryStorage } = require('multer-storage-cloudinary');

const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'profile',
    allowedFormats: ['jpg', 'png', 'jpeg'],
  },
});
const upload = multer({ storage: storage });

router.post('/image', upload.single('image'), (req, res) => {
  if (req.file && req.file.path) {
    return res.json({ url: req.file.path });
  } else {
    return res.status(400).json({ message: "Upload failed" });
  }
});

module.exports = router
