// /routes/upload.js

const express = require("express");
const router = express.Router();
const multer = require("multer");
const path = require("path");
const config = require("../config/config");
const axios = require("axios");

// Configure Multer storage
const storage = multer.memoryStorage();
const upload = multer({
  storage,
  limits: { fileSize: 10 * 1024 * 1024 }, // Limit file size to 10MB
  fileFilter: (req, file, cb) => {
    // Allow only images
    const filetypes = /jpeg|jpg/;
    const mimetype = filetypes.test(file.mimetype);
    const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
    if (mimetype && extname) {
      return cb(null, true);
    }
    cb(new Error("Only JPEGs are allowed"));
  },
});

// Route: POST /upload
router.post("/", upload.single("image"), async (req, res) => {
  const { option, target_type, target_format } = req.body;
  const image = req.file;

  // Validate required fields
  if (!image || !option) {
    return res.status(400).render("error", {
      message: "Image and option are required.",
    });
  }

  try {
    // Encode the file buffer to Base64
    const dataStr = image.buffer.toString("base64");

    // Determine the action based on the selected option
    let action;
    if (option === "classify") {
      action = "typeid";
    } else if (option === "transform") {
      action = "typecov";
      if (!target_type) {
        return res.status(400).render("error", {
          message: "target_type is required for transform option.",
        });
      }
    } else if (option === "transfer") {
      action = "formatcov";
      if (!target_format) {
        return res.status(400).render("error", {
          message: "target_format is required for transfer option.",
        });
      }
    } else {
      return res.status(400).render("error", {
        message: "Invalid option selected.",
      });
    }

    // Construct the API endpoint
    const apiEndpoint = `${config.api.baseurl}/jpg/${action}/80001`;

    // Prepare the JSON payload
    const payload = {
      filename: image.originalname,
      data: dataStr,
    };

    if (option === "transform") {
      payload.target_type = target_type;
    }

    if (option === "transfer") {
      payload.target_format = target_format;
    }

    // Log the request details for debugging
    console.log("Sending request to API:");
    console.log("Endpoint:", apiEndpoint);
    console.log("Payload:", payload);
    console.log("Headers:", {"Content-Type": "application/json"});

    // Send POST request to the API with authentication
    const response = await axios.post(apiEndpoint, payload, {
      headers: {"Content-Type": "application/json"},
      timeout: 10000, // Set a timeout of 10 seconds
    });

    // Handle the response
    if (response.status === 200) {
      const jobid = response.data.jobid || response.data; // Adjust based on API response structure
      console.log("Processing started, job id =", jobid);

      // Render the processing page
      res.render("processed", {
        message: "Processing",
        jobid: jobid,
      });
    } else {
      console.error("Unexpected response status:", response.status);
      res.status(response.status).render("error", {
        message: `Unexpected response status: ${response.status}`,
      });
    }
  } catch (error) {
    console.error("Error processing upload:", error);

    // Enhanced error handling
    if (error.response) {
      // The request was made and the server responded with a status code outside the 2xx range
      console.error("API Response Status:", error.response.status);
      console.error("API Response Data:", error.response.data);
      res.status(error.response.status).render("error", {
        message: error.response.data.message || "An error occurred with the API.",
      });
    } else if (error.request) {
      // The request was made but no response was received
      console.error("No response received from the API.");
      res.status(500).render("error", {
        message: "No response received from the API.",
      });
    } else {
      // Something happened in setting up the request
      console.error("Error setting up the request:", error.message);
      res.status(500).render("error", {
        message: "An error occurred while setting up the request.",
      });
    }
  }
});

module.exports = router;
