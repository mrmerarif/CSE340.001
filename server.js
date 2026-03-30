// ------------------------------------------------------------
// SESSION + FLASH MIDDLEWARE (MUST LOAD FIRST)
// ------------------------------------------------------------
// These two imports must be at the top because session and flash
// need to run before ANY routes or templates are processed.
import session from 'express-session';
import flash from './src/middleware/flash.js';

import express from 'express';
import { fileURLToPath } from 'url';
import path from 'path';
import { testConnection } from './src/models/db.js';
import router from './src/controllers/routes.js';


// ------------------------------------------------------------
// ENVIRONMENT SETUP
// ------------------------------------------------------------
// Determine whether the app is running in development or production.
// This affects logging and error visibility.
const NODE_ENV = process.env.NODE_ENV?.toLowerCase() || 'production';

// Define the port number the server will listen on.
const PORT = process.env.PORT || 3000;

// Recreate __filename and __dirname for ES modules.
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Create the Express application instance.
const app = express();


// ------------------------------------------------------------
// SESSION + FLASH MIDDLEWARE (CORRECT ORDER)
// ------------------------------------------------------------
// IMPORTANT: These MUST come before body parsing, static files,
// routes, and anything that renders templates.

// 1. Session middleware (stores session data for each user)
app.use(session({
  secret: 'your-secret-key',     // In a later activity you'll secure this
  resave: false,
  saveUninitialized: true,
  cookie: { maxAge: 60 * 60 * 1000 } // Session expires after 1 hour
}));

// 2. Flash middleware (depends on session)
app.use(flash);


// ------------------------------------------------------------
// BODY PARSING MIDDLEWARE
// ------------------------------------------------------------
// These two lines allow Express to read form data (POST requests).
// Without them, req.body will always be undefined.
app.use(express.urlencoded({ extended: true }));
app.use(express.json());


// ------------------------------------------------------------
// STATIC FILES
// ------------------------------------------------------------
// Serve static files (CSS, images, JS) from the public directory.
app.use(express.static(path.join(__dirname, 'public')));


// ------------------------------------------------------------
// VIEW ENGINE SETUP
// ------------------------------------------------------------
// Enable EJS as the templating engine.
app.set('view engine', 'ejs');

// Tell Express where to find your EJS templates.
app.set('views', path.join(__dirname, 'src/views'));


// ------------------------------------------------------------
// DEVELOPMENT LOGGING
// ------------------------------------------------------------
// Log all incoming requests in development mode.
app.use((req, res, next) => {
  if (NODE_ENV === 'development') {
    console.log(`${req.method} ${req.url}`);
  }
  next();
});

// Make NODE_ENV available inside all EJS templates.
app.use((req, res, next) => {
  res.locals.NODE_ENV = NODE_ENV;
  next();
});


// ------------------------------------------------------------
// ROUTES
// ------------------------------------------------------------
// Use the imported router to handle all application routes.
app.use(router);


// ------------------------------------------------------------
// ERROR HANDLING
// ------------------------------------------------------------

// Catch-all route for 404 (page not found) errors.
app.use((req, res, next) => {
  const err = new Error('Page Not Found');
  err.status = 404;
  next(err);
});

// Global error handler for all server errors.
app.use((err, req, res, next) => {
  console.error('Error occurred:', err.message);
  console.error('Stack trace:', err.stack);

  const status = err.status || 500;
  const template = status === 404 ? '404' : '500';

  const context = {
    title: status === 404 ? 'Page Not Found' : 'Server Error',
    error: err.message,
    stack: err.stack
  };

  res.status(status).render(`errors/${template}`, context);
});


// ------------------------------------------------------------
// START THE SERVER
// ------------------------------------------------------------
app.listen(PORT, async () => {
  try {
    await testConnection();
    console.log(`Server is running at http://127.0.0.1:${PORT}`);
    console.log(`Environment: ${NODE_ENV}`);
  } catch (error) {
    console.error('Error connecting to the database:', error);
  }
});
