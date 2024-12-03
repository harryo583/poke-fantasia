
// Handles the root route (/).
// Renders the main page where users can upload images and select options.

const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
  res.render('index');
});

module.exports = router;
