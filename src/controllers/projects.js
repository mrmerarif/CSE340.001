import { getAllProjects, getProjectDetails } from '../models/projects.js';

// List all projects
const showProjectsPage = async (req, res) => {
    const projects = await getAllProjects();
    const title = 'Service Projects';
    res.render('projects', { title, projects });
};

// Show a single project details page
const showProjectDetailsPage = async (req, res, next) => {
    const projectId = req.params.id;
    const project = await getProjectDetails(projectId);

    if (!project) {
        const err = new Error('Project Not Found');
        err.status = 404;
        return next(err);
    }

    const title = project.title;
    res.render('project', { title, project });
};

export { showProjectsPage, showProjectDetailsPage };
