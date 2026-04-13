import express from 'express';

// ------------------------------------------------------------
// Main pages
// ------------------------------------------------------------
import { showHomePage } from '../controllers/index.js';

// ------------------------------------------------------------
// Organization controllers
// ------------------------------------------------------------
import {
    showOrganizationsPage,
    showOrganizationDetailsPage,
    showNewOrganizationForm,
    processNewOrganizationForm,
    organizationValidation,
    showEditOrganizationForm,
    processEditOrganizationForm
} from '../controllers/organizations.js';

// ------------------------------------------------------------
// Project controllers
// ------------------------------------------------------------
import { 
    showProjectsPage, 
    showProjectDetailsPage,
    showNewProjectForm,
    processNewProjectForm,
    projectValidation,
    showEditProjectForm,
    processEditProjectForm
} from '../controllers/projects.js';

// ------------------------------------------------------------
// Category controllers
// ------------------------------------------------------------
import { 
    showCategoriesPage, 
    showCategoryDetailsPage,
    showAssignCategoriesForm,
    processAssignCategoriesForm,

    showNewCategoryForm,
    createCategoryValidation,
    processNewCategoryForm,

    showEditCategoryForm,
    editCategoryValidation,
    processEditCategoryForm
} from '../controllers/categories.js';

// ------------------------------------------------------------
// User controllers
// ------------------------------------------------------------
import { 
    showUserRegistrationForm, 
    processUserRegistrationForm,
    showLoginForm,
    processLoginForm,
    processLogout,
    requireLogin,
    requireRole,
    showDashboard,
    showUsersPage
} from '../controllers/users.js';

// ------------------------------------------------------------
// Volunteer controllers
// ------------------------------------------------------------
import {
    volunteerForProject,
    unvolunteerFromProject
} from '../controllers/volunteers.js';

// ------------------------------------------------------------
// Error test route
// ------------------------------------------------------------
import { testErrorPage } from '../controllers/errors.js';

// ------------------------------------------------------------
// Router setup
// ------------------------------------------------------------
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

router.get('/new-organization', requireRole('admin'), showNewOrganizationForm);
router.post('/new-organization', requireRole('admin'), organizationValidation, processNewOrganizationForm);

router.get('/edit-organization/:id', requireRole('admin'), showEditOrganizationForm);
router.post('/edit-organization/:id', requireRole('admin'), organizationValidation, processEditOrganizationForm);

// ------------------------------------------------------------
// Projects
// ------------------------------------------------------------
router.get('/projects', showProjectsPage);
router.get('/project/:id', showProjectDetailsPage);

router.get('/new-project', requireRole('admin'), showNewProjectForm);
router.post('/new-project', requireRole('admin'), projectValidation, processNewProjectForm);

router.get('/edit-project/:id', requireRole('admin'), showEditProjectForm);
router.post('/edit-project/:id', requireRole('admin'), projectValidation, processEditProjectForm);

router.get('/assign-categories/:projectId', requireRole('admin'), showAssignCategoriesForm);
router.post('/assign-categories/:projectId', requireRole('admin'), processAssignCategoriesForm);

// ------------------------------------------------------------
// Volunteers
// ------------------------------------------------------------
router.get('/project/:id/volunteer', requireLogin, volunteerForProject);
router.get('/project/:id/unvolunteer', requireLogin, unvolunteerFromProject);

// ------------------------------------------------------------
// Categories
// ------------------------------------------------------------
router.get('/categories', showCategoriesPage);
router.get('/category/:id', showCategoryDetailsPage);

router.get('/new-category', requireRole('admin'), showNewCategoryForm);
router.post('/new-category', requireRole('admin'), createCategoryValidation, processNewCategoryForm);

router.get('/edit-category/:id', requireRole('admin'), showEditCategoryForm);
router.post('/edit-category/:id', requireRole('admin'), editCategoryValidation, processEditCategoryForm);

// ------------------------------------------------------------
// Auth
// ------------------------------------------------------------
router.get('/register', showUserRegistrationForm);
router.post('/register', processUserRegistrationForm);

router.get('/login', showLoginForm);
router.post('/login', processLoginForm);

router.get('/logout', processLogout);

// ------------------------------------------------------------
// Dashboard + admin
// ------------------------------------------------------------
router.get('/dashboard', requireLogin, showDashboard);
router.get('/users', requireRole('admin'), showUsersPage);

// ------------------------------------------------------------
// Debug route
// ------------------------------------------------------------
router.get('/test-error', testErrorPage);

// ------------------------------------------------------------
export default router;