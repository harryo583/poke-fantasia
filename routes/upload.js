// /routes/upload.js

const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');

// Configure Multer storage
const storage = multer.memoryStorage();
const upload = multer({ storage });

router.post('/', upload.single('image'), (req, res) => {
  const { option } = req.body;
  const image = req.file;

  if (!image || !option) {
    return res.status(400).send('Image and option are required.');
  }

  // TODO: Upload the image to the appropriate S3 bucket and trigger Lambda function

  // For now, we'll simulate this by saving the image locally and rendering it

  // Save the image to 'public/uploads' for demonstration purposes
  const fs = require('fs');
  const uploadPath = path.join(__dirname, '..', 'public', 'uploads');
  if (!fs.existsSync(uploadPath)) {
    fs.mkdirSync(uploadPath);
  }
  const filePath = path.join(uploadPath, image.originalname);
  fs.writeFileSync(filePath, image.buffer);

  res.render('processed', { imageUrl: `/uploads/${image.originalname}` });
});

module.exports = router;
