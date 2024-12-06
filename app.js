// app.js
require("dotenv").config();


const express = require('express');
const path = require('path');
const app = express();

// Routes
const indexRouter = require('./routes/index');
const uploadRouter = require('./routes/upload');
const statusRouter = require('./routes/status'); // Import the new status router

// Set view engine
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Middleware
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.urlencoded({ extended: true }));
app.use('/assets', express.static('assets'));

// Use routes
app.use('/', indexRouter);
app.use('/upload', uploadRouter);
app.use('/status', statusRouter); // Register the status route

// Handle undefined routes
app.use((req, res) => {
  res.status(404).render('error', { message: 'Page not found.' });
});

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
