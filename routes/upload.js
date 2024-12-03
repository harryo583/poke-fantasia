// Handles the image upload functionality

// routes/upload.js

// !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
// !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
// !!!!!!!!!!!!!!!!!!!!!!!!!!!!! TODO UNCOMMENT THIS SECTION !!!!!!!!!!!!!!!!!!!!!!!!!!
// !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
// !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!

// Inside the POST handler in routes/upload.js
// const AWS = require('aws-sdk');
// const config = require('../config/config');

// AWS.config.update(config.aws);

// const s3 = new AWS.S3();
// let bucketName;

// switch (option) {
//   case 'option1':
//     bucketName = config.s3.bucketOption1;
//     break;
//   case 'option2':
//     bucketName = config.s3.bucketOption2;
//     break;
//   case 'option3':
//     bucketName = config.s3.bucketOption3;
//     break;
//   default:
//     return res.status(400).send('Invalid option selected.');
// }

// const params = {
//   Bucket: bucketName,
//   Key: image.originalname,
//   Body: image.buffer,
//   ContentType: image.mimetype,
// };

// s3.upload(params, (err, data) => {
//   if (err) {
//     console.error(err);
//     return res.status(500).send('Error uploading image to S3.');
//   }

//   // TODO: Trigger Lambda function

//   // For now, redirect to a page indicating the image was uploaded
//   res.render('processed', { imageUrl: data.Location });
// });



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
