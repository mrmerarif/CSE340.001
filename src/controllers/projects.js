// ------------------------------------------------------------
// CONTROLLER: Projects
// ------------------------------------------------------------

import { 
  getAllProjects, 
  getProjectDetails,
  createProject,
  updateProject,
  getProjectById
} from '../models/projects.js';

import { getCategoriesByProjectId } from '../models/categories.js';
import { getAllOrganizations } from '../models/organizations.js';

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
// List all projects
// ------------------------------------------------------------
const showProjectsPage = async (req, res, next) => {
  try {
    const projects = await getAllProjects();
    res.render('projects', { title: 'Service Projects', projects });
  } catch (err) {
    next(err);
  }
};

// ------------------------------------------------------------
// Show project details
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

    res.render('project', { 
      title: project.title, 
      project, 
      categories 
    });

  } catch (err) {
    next(err);
  }
};

// ------------------------------------------------------------
// Show NEW PROJECT form
// ------------------------------------------------------------
const showNewProjectForm = async (req, res) => {
  const organizations = await getAllOrganizations();

  res.render('new-project', { 
    title: 'Add New Service Project',
    organizations,
    errors: [],
    values: {}
  });
};

// ------------------------------------------------------------
// Process NEW PROJECT form
// ------------------------------------------------------------
const processNewProjectForm = async (req, res) => {

  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    const organizations = await getAllOrganizations();

    return res.render('new-project', {
      title: 'Add New Service Project',
      organizations,
      errors: errors.array(),
      values: req.body
    });
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
// Show EDIT PROJECT form
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

    res.render('edit-project', {
      title: `Edit Project: ${project.title}`,
      project,
      organizations,
      errors: [],
      values: {}
    });

  } catch (err) {
    next(err);
  }
};

// ------------------------------------------------------------
// Process EDIT PROJECT form
// ------------------------------------------------------------
const processEditProjectForm = async (req, res) => {

  const errors = validationResult(req);
  const projectId = req.params.id;

  if (!errors.isEmpty()) {
    const project = await getProjectById(projectId);
    const organizations = await getAllOrganizations();

    return res.render('edit-project', {
      title: `Edit Project: ${project.title}`,
      project,
      organizations,
      errors: errors.array(),
      values: req.body
    });
  }

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
// Export controllers
// ------------------------------------------------------------
export { 
  showProjectsPage, 
  showProjectDetailsPage,
  showNewProjectForm,
  processNewProjectForm,
  projectValidation,
  showEditProjectForm,
  processEditProjectForm
};
