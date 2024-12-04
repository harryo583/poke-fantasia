// /routes/upload.js

const express = require("express");
const router = express.Router();
const multer = require("multer");
const AWS = require("aws-sdk");
const path = require("path");
const config = require("../config/config");

// Configure AWS SDK with your credentials and region
AWS.config.update(config.aws);

// Configure Multer storage
const storage = multer.memoryStorage();
const upload = multer({ storage });

// Create an S3 service object
const s3 = new AWS.S3();

router.post("/", upload.single("image"), (req, res) => {
  const { option } = req.body;
  const image = req.file;

  if (!image || !option) {
    return res.status(400).render("error", {
      message: "Image and option are required.",
    });
  }

  try {
    // Determine the folder based on the selected option
    let folderName;
    switch (option) {
      case "option1":
        folderName = config.s3.folderOption1;
        break;
      case "option2":
        folderName = config.s3.folderOption2;
        break;
      case "option3":
        folderName = config.s3.folderOption3;
        break;
      default:
        return res.status(400).render("error", {
          message: "Invalid option selected.",
        });
    }

    const bucketName = config.s3.bucketName;

    // Upload the image to the appropriate folder in the S3 bucket
    const params = {
      Bucket: bucketName,
      Key: folderName + image.originalname,
      Body: image.buffer,
      ContentType: image.mimetype,
    };

    s3.upload(params, (err, data) => {
      if (err) {
        console.error("Error uploading image to S3:", err);
        return res.status(500).render("error", {
          message: "An error occurred while uploading the image to S3.",
        });
      }

      console.log(`Image uploaded successfully to ${bucketName}/${folderName}`);

      // Since the Lambda function is triggered by the S3 upload event,
      // we don't need to invoke it directly.

      // Inform the user that their image is being processed
      res.render("processing", {
        message: "Your image is being processed. This may take a few moments.",
        imageName: image.originalname,
        folderName: folderName,
        bucketName: bucketName,
      });
    });
  } catch (err) {
    console.error(err);
    res.status(500).render("error", {
      message: "An error occurred while processing your image.",
    });
  }
});

module.exports = router;