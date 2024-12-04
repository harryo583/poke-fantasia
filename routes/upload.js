// /routes/upload.js

const express = require("express");
const router = express.Router();
const multer = require("multer");
const { S3 } = require("@aws-sdk/client-s3");
const { Upload } = require("@aws-sdk/lib-storage");
const path = require("path");
const config = require("../config/config");

// Configure Multer storage
const storage = multer.memoryStorage();
const upload = multer({ storage });

// Create an S3 service object
// const s3 = new S3(config.aws);
const s3 = new S3(config.awsReadWrite);


router.post("/", upload.single("image"), async (req, res) => {
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
      case "classify":
        folderName = config.s3.folderOption1;
        break;
      case "transform":
        folderName = config.s3.folderOption2;
        break;
      case "transfer":
        folderName = config.s3.folderOption3;
        break;
      default:
        return res.status(400).render("error", {
          message: "Invalid option selected.",
        });
    }

    const bucketName = config.s3.bucketName;

    // Prepare the parameters for S3 upload
    const params = {
      Bucket: bucketName,
      Key: `${folderName}/${image.originalname}`,
      Body: image.buffer,
      ContentType: image.mimetype,
    };

    // Upload the image to S3
    const upload = new Upload({
      client: s3,
      params,
    });

    const result = await upload.done();
    console.log(`Image uploaded successfully to ${result.Location}`);

    // Inform the user that their image is being processed
    res.render("processing", {
      message: "Your image is being processed. This may take a few moments.",
      imageName: image.originalname,
      folderName: folderName,
      bucketName: bucketName,
    });
  } catch (err) {
    console.error("Error processing upload:", err);
    res.status(500).render("error", {
      message: "An error occurred while processing your image.",
    });
  }
});

module.exports = router;
