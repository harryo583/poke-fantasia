// The main entry point of the application. Sets up the Express server, middleware,
// and routes. Configures view engine and static file serving.

const express = require('express');
const app = express();
const path = require('path');

// Set view engine
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Serve static files
app.use(express.static(path.join(__dirname, 'public')));

// Routes
const indexRouter = require('./routes/index');
const uploadRouter = require('./routes/upload');
const processedRouter = require('./routes/processed');

app.use('/', indexRouter);
app.use('/upload', uploadRouter);
app.use('/processed', processedRouter);

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
