// ------------------------------------------------------------
// CONTROLLER: Projects
// ------------------------------------------------------------
// This file contains all controller functions related to
// displaying projects, showing project details, rendering
// the "new project" form, and processing new project submissions.
// ------------------------------------------------------------

import { 
  getAllProjects, 
  getProjectDetails,
  createProject            // <-- NEW: Insert new project into DB
} from '../models/projects.js';

import { getCategoriesByProjectId } from '../models/categories.js';
import { getAllOrganizations } from '../models/organizations.js'; // <-- NEW: Needed for dropdown

// Validation tools
import { body, validationResult } from 'express-validator';

// ------------------------------------------------------------
// Validation rules for NEW PROJECT form
// ------------------------------------------------------------
const projectValidation = [
  body('title')
    .trim()
    .notEmpty().withMessage('Title is required')
    .isLength({ min: 3, max: 200 })
    .withMessage('Title must be between 3 and 200 characters'),

  body('description')
    .trim()
    .notEmpty().withMessage('Description is required')
    .isLength({ max: 1000 })
    .withMessage('Description must be less than 1000 characters'),

  body('location')
    .trim()
    .notEmpty().withMessage('Location is required')
    .isLength({ max: 200 })
    .withMessage('Location must be less than 200 characters'),

  body('date')
    .notEmpty().withMessage('Date is required')
    .isISO8601().withMessage('Date must be a valid date'),

  body('organizationId')
    .notEmpty().withMessage('Organization is required')
    .isInt().withMessage('Organization must be a valid integer')
];

// ------------------------------------------------------------
// Controller: List all projects
// ------------------------------------------------------------
const showProjectsPage = async (req, res, next) => {
  try {
    const projects = await getAllProjects();
    const title = 'Service Projects';
    res.render('projects', { title, projects });
  } catch (err) {
    next(err);
  }
};

// ------------------------------------------------------------
// Controller: Show details for a single project
// ------------------------------------------------------------
const showProjectDetailsPage = async (req, res, next) => {
  try {
    const projectId = req.params.id;

    const project = await getProjectDetails(projectId);

    if (!project) {
      const err = new Error('Project Not Found');
      err.status = 404;
      return next(err);
    }

    // Load categories for this project
    const categories = await getCategoriesByProjectId(projectId);

    const title = project.title;

    res.render('project', { title, project, categories });
  } catch (err) {
    next(err);
  }
};

// ------------------------------------------------------------
// Controller: Show the "New Project" form
// ------------------------------------------------------------
// Loads all organizations so the dropdown can be populated.
const showNewProjectForm = async (req, res) => {
  const organizations = await getAllOrganizations();
  const title = 'Add New Service Project';

  res.render('new-project', { title, organizations });
};

// ------------------------------------------------------------
// Controller: Process the "New Project" form submission
// ------------------------------------------------------------
const processNewProjectForm = async (req, res) => {

  // Check for validation errors
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    errors.array().forEach(error => {
      req.flash('error', error.msg);
    });
    return res.redirect('/new-project');
  }

  // Extract form data
  const { title, description, location, date, organizationId } = req.body;

  try {
    // Insert new project into DB
    const newProjectId = await createProject(
      title,
      description,
      location,
      date,
      organizationId
    );

    req.flash('success', 'New service project created successfully!');
    res.redirect(`/project/${newProjectId}`);

  } catch (error) {
    console.error('Error creating new project:', error);
    req.flash('error', 'There was an error creating the service project.');
    res.redirect('/new-project');
  }
};

// ------------------------------------------------------------
// Export all controllers
// ------------------------------------------------------------
export { 
  showProjectsPage, 
  showProjectDetailsPage,
  showNewProjectForm,          // <-- NEW
  processNewProjectForm,       // <-- NEW
  projectValidation            // <-- NEW
};
