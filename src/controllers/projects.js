// ------------------------------------------------------------
// CONTROLLER: Projects
// ------------------------------------------------------------
// This file contains all controller functions related to
// displaying projects, showing project details, rendering
// the "new project" form, processing new project submissions,
// and NOW editing existing projects.
// ------------------------------------------------------------

import { 
  getAllProjects, 
  getProjectDetails,
  createProject,
  updateProject,            // <-- NEW: Update existing project in DB
  getProjectById            // <-- NEW: Load project for edit form
} from '../models/projects.js';

import { getCategoriesByProjectId } from '../models/categories.js';
import { getAllOrganizations } from '../models/organizations.js';

// Validation tools
import { body, validationResult } from 'express-validator';

// ------------------------------------------------------------
// Validation rules for NEW + EDIT PROJECT forms
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
const showNewProjectForm = async (req, res) => {
  const organizations = await getAllOrganizations();
  const title = 'Add New Service Project';

  res.render('new-project', { title, organizations });
};

// ------------------------------------------------------------
// Controller: Process the "New Project" form submission
// ------------------------------------------------------------
const processNewProjectForm = async (req, res) => {

  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    errors.array().forEach(error => req.flash('error', error.msg));
    return res.redirect('/new-project');
  }

  const { title, description, location, date, organizationId } = req.body;

  try {
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
// NEW: Controller — Show the "Edit Project" form
// ------------------------------------------------------------
const showEditProjectForm = async (req, res, next) => {
  try {
    const projectId = req.params.id;

    const project = await getProjectById(projectId);
    if (!project) {
      const err = new Error('Project Not Found');
      err.status = 404;
      return next(err);
    }

    const organizations = await getAllOrganizations();
    const title = `Edit Project: ${project.title}`;

    res.render('edit-project', { title, project, organizations });

  } catch (err) {
    next(err);
  }
};

// ------------------------------------------------------------
// NEW: Controller — Process the "Edit Project" form submission
// ------------------------------------------------------------
const processEditProjectForm = async (req, res) => {

  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    errors.array().forEach(error => req.flash('error', error.msg));
    return res.redirect(`/edit-project/${req.params.id}`);
  }

  const projectId = req.params.id;
  const { title, description, location, date, organizationId } = req.body;

  try {
    await updateProject(
      projectId,
      title,
      description,
      location,
      date,
      organizationId
    );

    req.flash('success', 'Project updated successfully!');
    res.redirect(`/project/${projectId}`);

  } catch (error) {
    console.error('Error updating project:', error);
    req.flash('error', 'There was an error updating the project.');
    res.redirect(`/edit-project/${projectId}`);
  }
};

// ------------------------------------------------------------
// Export all controllers
// ------------------------------------------------------------
export { 
  showProjectsPage, 
  showProjectDetailsPage,
  showNewProjectForm,
  processNewProjectForm,
  projectValidation,

  // NEW: Edit project controllers
  showEditProjectForm,
  processEditProjectForm
};
