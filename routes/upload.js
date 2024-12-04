// /routes/upload.js

const express = require("express");
const router = express.Router();
const multer = require("multer");
const path = require("path");
const config = require("../config/config");
const axios = require("axios"); // Import axios for HTTP requests

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

// Route: POST /upload
router.post("/", upload.single("image"), async (req, res) => {
  const { option, target_type, target_format } = req.body;
  const image = req.file;

  if (!image || !option) {
    return res.status(400).render("error", {
      message: "Image and option are required.",
    });
  }

  try {
    // Encode the file buffer to Base64
    const dataStr = image.buffer.toString("base64");

    // Prepare the JSON payload based on the option
    const payload = {
      filename: image.originalname,
      data: dataStr,
    };

    if (option === "classify") {
      payload.action = "typeid";
    }

    if (option === "transform") {
      payload.action = "typecov";
      if (!target_type) {
        return res.status(400).render("error", {
          message: "target_type is required for transform option.",
        });
      }
      payload.target_type = target_type;
    }

    if (option === "transfer") {
      payload.action = "formatcov";
      if (!target_format) {
        return res.status(400).render("error", {
          message: "target_format is required for transfer option.",
        });
      }
      payload.target_format = target_format;
    }

    // Define the API endpoint
    const apiEndpoint = config.api.endpoint;

    // Send POST request to the API
    const response = await axios.post(apiEndpoint, payload, {
      headers: {
        "Content-Type": "application/json",
      },
      timeout: 10000, // set a timeout of 10 seconds
    });

    // Handle the response
    if (response.status === 200) {
      const jobid = response.data.jobid || response.data; // adjust based on API response structure
      console.log("Processing started, job id =", jobid);

      // Render the processing page
      res.render("processed", {
        message: "Processing",
        jobid: jobid,
      });
    } else if (response.status === 400) {
      const body = response.data;
      console.error("Error: Bad Request", body);
      res.status(400).render("error", {
        message: body.message || "Bad Request.",
      });
    } else {
      console.error("Failed with status code:", response.status);
      if (response.status === 500) {
        const body = response.data;
        console.error(
          "Error message:",
          body.message || "Internal Server Error."
        );
        res.status(500).render("error", {
          message: body.message || "An internal server error occurred.",
        });
      } else {
        res.status(response.status).render("error", {
          message: `Failed with status code: ${response.status}`,
        });
      }
    }
  } catch (error) {
    console.error("Error processing upload:", error);

    // Check if the error is from the API response
    if (error.response) {
      const { status, data } = error.response;
      if (status === 400) {
        res.status(400).render("error", {
          message: data.message || "Bad Request.",
        });
      } else if (status === 500) {
        res.status(500).render("error", {
          message: data.message || "Internal Server Error.",
        });
      } else {
        res.status(status).render("error", {
          message: data.message || `Failed with status code: ${status}`,
        });
      }
    } else if (error.request) {
      // The request was made but no response was received
      res.status(500).render("error", {
        message: "No response received from the server.",
      });
    } else {
      // Something happened in setting up the request
      res.status(500).render("error", {
        message: "An error occurred while setting up the request.",
      });
    }
  }
});

module.exports = router;
