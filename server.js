// ------------------------------------------------------------
// LOAD ENVIRONMENT VARIABLES (MUST BE FIRST)
// ------------------------------------------------------------
import 'dotenv/config';

// ------------------------------------------------------------
// CORE IMPORTS
// ------------------------------------------------------------
import express from 'express';
import session from 'express-session';
import { fileURLToPath } from 'url';
import path from 'path';
import router from './src/controllers/routes.js';
import { testConnection } from './src/models/db.js';

// Flash middleware
import flash from './src/middleware/flash.js';

// ------------------------------------------------------------
// ENVIRONMENT SETUP
// ------------------------------------------------------------
const NODE_ENV = process.env.NODE_ENV?.toLowerCase() || 'production';
const PORT = process.env.PORT || 3000;

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

// ------------------------------------------------------------
// BODY PARSING (MUST COME BEFORE SESSION + FLASH)
// ------------------------------------------------------------
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ------------------------------------------------------------
// SESSION (MUST COME BEFORE FLASH)
// ------------------------------------------------------------
app.use(
  session({
    secret: process.env.SESSION_SECRET || 'default-secret',
    resave: false,
    saveUninitialized: false,
    cookie: { maxAge: 60 * 60 * 1000 }, // 1 hour
  })
);

// ------------------------------------------------------------
// FLASH (MUST COME AFTER SESSION — DO NOT CALL flash())
// ------------------------------------------------------------
app.use(flash);

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
// MAKE LOGIN STATE AVAILABLE TO ALL VIEWS
// ------------------------------------------------------------
app.use((req, res, next) => {
  res.locals.isLoggedIn = Boolean(req.session?.user);
  res.locals.user = req.session?.user || null;
  res.locals.NODE_ENV = NODE_ENV;
  next();
});

// ------------------------------------------------------------
// ROUTES
// ------------------------------------------------------------
app.use('/', router);

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

  res.status(status).render(`errors/${template}`, {
    title: status === 404 ? 'Page Not Found' : 'Server Error',
    error: err.message,
    stack: err.stack,
  });
});

// ------------------------------------------------------------
// START SERVER
// ------------------------------------------------------------
app.listen(PORT, async () => {
  try {
    await testConnection();
    console.log(`Server running at http://127.0.0.1:${PORT}`);
    console.log(`Environment: ${NODE_ENV}`);
  } catch (error) {
    console.error('Database connection error:', error);
  }
});
