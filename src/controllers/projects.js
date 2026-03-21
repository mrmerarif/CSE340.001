import { getAllProjects, getProjectDetails } from '../models/projects.js';
import { getCategoriesByProjectId } from '../models/categories.js';

// List all projects
const showProjectsPage = async (req, res, next) => {
  try {
    const projects = await getAllProjects();
    const title = 'Service Projects';
    res.render('projects', { title, projects });
  } catch (err) {
    next(err);
  }
};

// Show a single project details page
const showProjectDetailsPage = async (req, res, next) => {
  try {
    const projectId = req.params.id;

    const project = await getProjectDetails(projectId);

    if (!project) {
      const err = new Error('Project Not Found');
      err.status = 404;
      return next(err);
    }

    // NEW: Load categories for this project
    const categories = await getCategoriesByProjectId(projectId);

    const title = project.title;

    res.render('project', { title, project, categories });
  } catch (err) {
    next(err);
  }
};

export { showProjectsPage, showProjectDetailsPage };
