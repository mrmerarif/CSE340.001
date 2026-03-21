import express from 'express';

import { showHomePage } from './index.js';
import { showOrganizationsPage } from './organizations.js';
import { showProjectsPage, showProjectDetailsPage } from './projects.js';
import { showCategoriesPage } from './categories.js';
import { testErrorPage } from './errors.js';
import { showOrganizationDetailsPage } from './organizations.js';



const router = express.Router();

// Main pages
router.get('/', showHomePage);
router.get('/organizations', showOrganizationsPage);
router.get('/projects', showProjectsPage);
router.get('/project/:id', showProjectDetailsPage);
router.get('/categories', showCategoriesPage);

// Error test route
router.get('/test-error', testErrorPage);
router.get('/organization/:id', showOrganizationDetailsPage);



export default router;
