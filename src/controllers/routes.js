import express from 'express';

// Main pages
import { showHomePage } from './index.js';

// Organization controllers
import {
    showOrganizationsPage,
    showOrganizationDetailsPage,
    showNewOrganizationForm,
    processNewOrganizationForm,
    organizationValidation,
    showEditOrganizationForm,
    processEditOrganizationForm
} from '../controllers/organizations.js';

// Project controllers
import { 
    showProjectsPage, 
    showProjectDetailsPage,
    showNewProjectForm,
    processNewProjectForm,
    projectValidation,

    // Edit Project controllers
    showEditProjectForm,
    processEditProjectForm
} from '../controllers/projects.js';

// Category controllers
import { 
    showCategoriesPage, 
    showCategoryDetailsPage,
    showAssignCategoriesForm,
    processAssignCategoriesForm,

    // Create Category
    showNewCategoryForm,
    createCategoryValidation,
    processNewCategoryForm,

    // Edit Category
    showEditCategoryForm,
    editCategoryValidation,
    processEditCategoryForm
} from './categories.js';

// User registration + login controllers
import { 
    showUserRegistrationForm, 
    processUserRegistrationForm,
    showLoginForm,
    processLoginForm,
    processLogout,
    requireLogin,
    requireRole,
    showDashboard,
    showUsersPage      // Admin-only: Show list of all users
} from '../controllers/users.js';

// Error test route
import { testErrorPage } from './errors.js';

const router = express.Router();

// ------------------------------------------------------------
// Main pages
// ------------------------------------------------------------
router.get('/', showHomePage);

// ------------------------------------------------------------
// Organizations
// ------------------------------------------------------------
router.get('/organizations', showOrganizationsPage);
router.get('/organization/:id', showOrganizationDetailsPage);

// Admin-only: New organization
router.get('/new-organization', requireRole('admin'), showNewOrganizationForm);
router.post('/new-organization', requireRole('admin'), organizationValidation, processNewOrganizationForm);

// Admin-only: Edit organization
router.get('/edit-organization/:id', requireRole('admin'), showEditOrganizationForm);
router.post('/edit-organization/:id', requireRole('admin'), organizationValidation, processEditOrganizationForm);

// ------------------------------------------------------------
// Projects
// ------------------------------------------------------------
router.get('/projects', showProjectsPage);
router.get('/project/:id', showProjectDetailsPage);

// Admin-only: Add new project
router.get('/new-project', requireRole('admin'), showNewProjectForm);
router.post('/new-project', requireRole('admin'), projectValidation, processNewProjectForm);

// Admin-only: Edit existing project
router.get('/edit-project/:id', requireRole('admin'), showEditProjectForm);
router.post('/edit-project/:id', requireRole('admin'), projectValidation, processEditProjectForm);

//Admin-only: Assign categories to a project
router.get('/assign-categories/:projectId', requireRole('admin'), showAssignCategoriesForm);
router.post('/assign-categories/:projectId', requireRole('admin'), processAssignCategoriesForm);

// ------------------------------------------------------------
// Categories
// ------------------------------------------------------------
router.get('/categories', showCategoriesPage);
router.get('/category/:id', showCategoryDetailsPage);

//Admin-only: Create Category
router.get('/new-category', requireRole('admin'), showNewCategoryForm);
router.post('/new-category', requireRole('admin'), createCategoryValidation, processNewCategoryForm);

// Admin-only: Edit Category
router.get('/edit-category/:id', requireRole('admin'), showEditCategoryForm);
router.post('/edit-category/:id', requireRole('admin'), editCategoryValidation, processEditCategoryForm);

// ------------------------------------------------------------
// User Registration Routes
// ------------------------------------------------------------
router.get('/register', showUserRegistrationForm);
router.post('/register', processUserRegistrationForm);

// ------------------------------------------------------------
// User Login + Logout Routes
// ------------------------------------------------------------
router.get('/login', showLoginForm);
router.post('/login', processLoginForm);
router.get('/logout', processLogout);

// ------------------------------------------------------------
// Protected Dashboard Route
// ------------------------------------------------------------
router.get('/dashboard', requireLogin, showDashboard);

// ------------------------------------------------------------
// NEW: Admin-only Users Page
// ------------------------------------------------------------
router.get('/users', requireRole('admin'), showUsersPage);

// ------------------------------------------------------------
// Error test route
// ------------------------------------------------------------
router.get('/test-error', testErrorPage);

export default router;
