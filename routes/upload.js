// /routes/upload.js

const express = require("express");
const router = express.Router();
const multer = require("multer");
const path = require("path");
const config = require("../config/config");
const { S3 } = require("@aws-sdk/client-s3");
const { Upload } = require("@aws-sdk/lib-storage");

// Configure Multer storage
const storage = multer.memoryStorage();
const upload = multer({
  storage,
  limits: { fileSize: 10 * 1024 * 1024 }, // Limit file size to 10MB
  fileFilter: (req, file, cb) => {
    // Allow only images and PDFs
    const filetypes = /jpeg|jpg|png|pdf/;
    const mimetype = filetypes.test(file.mimetype);
    const extname = filetypes.test(
      path.extname(file.originalname).toLowerCase()
    );
    if (mimetype && extname) {
      return cb(null, true);
    }
    cb(new Error("Only JPEG, PNG images and PDFs are allowed"));
  },
});

// Create an S3 service object using awsReadWrite credentials
const s3 = new S3({
  region: config.awsReadWrite.region,
  credentials: {
    accessKeyId: config.awsReadWrite.accessKeyId,
    secretAccessKey: config.awsReadWrite.secretAccessKey,
  },
});

router.post("/", upload.single("image"), async (req, res) => {
  const { option } = req.body;
  const image = req.file;

  if (!image || !option) {
    return res.status(400).render("error", {
      message: "Image and option are required.",
    });
  }

  try {
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

    // Ensure folderName ends with a single slash
    folderName = folderName.endsWith("/") ? folderName : `${folderName}/`;

    // Prepare the parameters for S3 upload
    const params = {
      Bucket: bucketName,
      Key: `${folderName}${image.originalname}`,
      Body: image.buffer,
      ContentType: image.mimetype,
    };

    // Upload the image to S3 using the Upload class for managed uploads
    const uploadS3 = new Upload({
      client: s3,
      params,
      // Optionally add more configurations like queueSize, partSize, etc.
    });

    // Monitor upload progress (optional)
    uploadS3.on("httpUploadProgress", (progress) => {
      console.log(
        `Uploaded ${progress.loaded} of ${progress.total} bytes`
      );
    });

    const result = await uploadS3.done();
    console.log(`Image uploaded successfully to ${result.Location}`);

    // Inform the user that their image is being processed
    res.render("processed", {
      message:
        "Your image is being processed. This may take a few moments.",
      imageName: image.originalname,
      folderName: folderName,
      bucketName: bucketName,
    });
  } catch (err) {
    console.error("Error processing upload:", err);

    // Specific AWS S3 errors
    if (err.name === "AccessDenied") {
      return res.status(403).render("error", {
        message:
          "Access denied. Please check your AWS S3 permissions.",
      });
    }

    // Multer errors
    if (err instanceof multer.MulterError) {
      return res.status(400).render("error", {
        message: err.message,
      });
    }

    // Generic errors
    res.status(500).render("error", {
      message: "An error occurred while processing your image.",
    });
  }
});

module.exports = router;
