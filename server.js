// ------------------------------------------------------------
// LOAD ENVIRONMENT VARIABLES (MUST BE FIRST)
// ------------------------------------------------------------
import 'dotenv/config';

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
const NODE_ENV = process.env.NODE_ENV?.toLowerCase() || 'production';
const PORT = process.env.PORT || 3000;

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();


// ------------------------------------------------------------
// SESSION + FLASH MIDDLEWARE (CORRECT ORDER)
// ------------------------------------------------------------
app.use(session({
  secret: 'your-secret-key',     // In a later activity you'll secure this
  resave: false,
  saveUninitialized: true,
  cookie: { maxAge: 60 * 60 * 1000 } // Session expires after 1 hour
}));

// ⭐ FIXED: flash() MUST be called
app.use(flash());


// ------------------------------------------------------------
// BODY PARSING MIDDLEWARE
// ------------------------------------------------------------
app.use(express.urlencoded({ extended: true }));
app.use(express.json());


// ------------------------------------------------------------
// STATIC FILES
// ------------------------------------------------------------
app.use(express.static(path.join(__dirname, 'public')));


// ------------------------------------------------------------
// VIEW ENGINE SETUP
// ------------------------------------------------------------
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'src/views'));


// ------------------------------------------------------------
// DEVELOPMENT LOGGING
// ------------------------------------------------------------
app.use((req, res, next) => {
  if (NODE_ENV === 'development') {
    console.log(`${req.method} ${req.url}`);
  }
  next();
});


// ------------------------------------------------------------
// UPDATED: Make login state, user, and NODE_ENV available to all templates
// ------------------------------------------------------------
app.use((req, res, next) => {
  res.locals.isLoggedIn = false;

  if (req.session && req.session.user) {
    res.locals.isLoggedIn = true;
  }

  // Make full user object available (including role_name)
  res.locals.user = req.session.user || null;

  res.locals.NODE_ENV = NODE_ENV;
  next();
});


// ------------------------------------------------------------
// ROUTES
// ------------------------------------------------------------
app.use(router);


// ------------------------------------------------------------
// ERROR HANDLING
// ------------------------------------------------------------
app.use((req, res, next) => {
  const err = new Error('Page Not Found');
  err.status = 404;
  next(err);
});

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
