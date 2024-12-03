// The main entry point of the application. Sets up the Express server, middleware,
// and routes. Configures view engine and static file serving.

// app.js
const express = require('express');
const path = require('path');
const app = express();

// Routes
const indexRouter = require('./routes/index');
const uploadRouter = require('./routes/upload');

// Set view engine
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Middleware
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.urlencoded({ extended: true }));

// Use Routes
app.use('/', indexRouter);
app.use('/upload', uploadRouter);

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});