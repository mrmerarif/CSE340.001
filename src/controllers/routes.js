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

    // ⭐ NEW: Edit Project controllers
    showEditProjectForm,
    processEditProjectForm
} from '../controllers/projects.js';

// Category controllers
import { 
    showCategoriesPage, 
    showCategoryDetailsPage,
    showAssignCategoriesForm,
    processAssignCategoriesForm,

    // NEW: Create Category
    showNewCategoryForm,
    createCategoryValidation,
    processNewCategoryForm,

    // NEW: Edit Category
    showEditCategoryForm,
    editCategoryValidation,
    processEditCategoryForm
} from './categories.js';

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

// New organization
router.get('/new-organization', showNewOrganizationForm);
router.post('/new-organization', organizationValidation, processNewOrganizationForm);

// Edit organization
router.get('/edit-organization/:id', showEditOrganizationForm);
router.post('/edit-organization/:id', organizationValidation, processEditOrganizationForm);

// ------------------------------------------------------------
// Projects
// ------------------------------------------------------------
router.get('/projects', showProjectsPage);
router.get('/project/:id', showProjectDetailsPage);

// NEW: Add new project
router.get('/new-project', showNewProjectForm);
router.post('/new-project', projectValidation, processNewProjectForm);

// ⭐ NEW: Edit existing project
// This allows the user to load the edit form for a project
router.get('/edit-project/:id', showEditProjectForm);

// This processes the submitted edit form and updates the DB
router.post('/edit-project/:id', projectValidation, processEditProjectForm);

// NEW: Assign categories to a project
router.get('/assign-categories/:projectId', showAssignCategoriesForm);
router.post('/assign-categories/:projectId', processAssignCategoriesForm);

// ------------------------------------------------------------
// Categories
// ------------------------------------------------------------
router.get('/categories', showCategoriesPage);
router.get('/category/:id', showCategoryDetailsPage);

// NEW: Create Category
router.get('/new-category', showNewCategoryForm);
router.post('/new-category', createCategoryValidation, processNewCategoryForm);

// NEW: Edit Category
router.get('/edit-category/:id', showEditCategoryForm);
router.post('/edit-category/:id', editCategoryValidation, processEditCategoryForm);

// ------------------------------------------------------------
// Error test route
// ------------------------------------------------------------
router.get('/test-error', testErrorPage);

export default router;
