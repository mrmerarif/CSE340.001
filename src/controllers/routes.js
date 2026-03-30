import express from 'express';

// Main pages
import { showHomePage } from './index.js';

// Organization controllers
import { 
    showOrganizationsPage, 
    showOrganizationDetailsPage,
    showNewOrganizationForm,
    processNewOrganizationForm
} from './organizations.js';

// Project controllers
import { showProjectsPage, showProjectDetailsPage } from './projects.js';

// Category controllers
import { showCategoriesPage, showCategoryDetailsPage } from './categories.js';

// Error test route
import { testErrorPage } from './errors.js';

const router = express.Router();

// Main pages
router.get('/', showHomePage);
router.get('/organizations', showOrganizationsPage);
router.get('/organization/:id', showOrganizationDetailsPage);

// Projects
router.get('/projects', showProjectsPage);
router.get('/project/:id', showProjectDetailsPage);

// Categories
router.get('/categories', showCategoriesPage);

// NEW: Category details page
router.get('/category/:id', showCategoryDetailsPage);

// Error test route
router.get('/test-error', testErrorPage);

// NEW ORGANIZATION FORM
router.get('/new-organization', showNewOrganizationForm);

// PROCESS NEW ORGANIZATION FORM
router.post('/new-organization', processNewOrganizationForm);

export default router;
