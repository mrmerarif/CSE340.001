import { getUpcomingProjects, getProjectDetails } from '../models/projects.js';

const NUMBER_OF_UPCOMING_PROJECTS = 15;

// Controller for the main projects page
export const showProjectsPage = async (req, res) => {
  try {
    const projects = await getUpcomingProjects(NUMBER_OF_UPCOMING_PROJECTS);
    res.render('projects', {
      title: 'Upcoming Service Projects',
      projects
    });
  } catch (error) {
    console.error('Error loading projects:', error);
    res.status(500).send('Server Error');
  }
};

// Controller for a single project details page
export const showProjectDetailsPage = async (req, res) => {
  try {
    const projectId = req.params.id;
    const project = await getProjectDetails(projectId);

    if (!project) {
      return res.status(404).send('Project not found');
    }

    res.render('project', {
      title: project.title,
      project
    });
  } catch (error) {
    console.error('Error loading project details:', error);
    res.status(500).send('Server Error');
  }
};
