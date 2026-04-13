import {
  getAllProjects,
  getProjectDetails,
  getProjectsByOrganizationId,
  createProject,
  updateProject
} from "../models/projects.js";

import { getCategoriesByProjectId } from "../models/categories.js";
import { getAllOrganizations } from "../models/organizations.js";
import { getVolunteerStatus } from "../models/projectvolunteers.js";
import { body, validationResult } from "express-validator";


// ------------------------------------------------------------
// VALIDATION RULES
// ------------------------------------------------------------
export const projectValidation = [
  body("title")
    .trim()
    .notEmpty()
    .withMessage("Title is required")
    .isLength({ min: 3 })
    .withMessage("Title must be at least 3 characters"),

  body("description")
    .trim()
    .notEmpty()
    .withMessage("Description is required"),

  body("location")
    .trim()
    .notEmpty()
    .withMessage("Location is required"),

  body("date")
    .notEmpty()
    .withMessage("Date is required"),

  body("organization_id")
    .notEmpty()
    .withMessage("Organization is required")
];


// ------------------------------------------------------------
// PROJECT LIST
// ------------------------------------------------------------
export const showProjectsPage = async (req, res, next) => {
  try {
    const projects = await getAllProjects();

    res.render("projects", {
      title: "Projects",
      projects
    });

  } catch (err) {
    next(err);
  }
};


// ------------------------------------------------------------
// PROJECT DETAILS
// ------------------------------------------------------------
export const showProjectDetailsPage = async (req, res, next) => {
  try {
    const projectId = req.params.id;

    const project = await getProjectDetails(projectId);
    if (!project) return next(new Error("Project not found"));

    const categories = await getCategoriesByProjectId(projectId);

    const userId = req.session.user?.user_id || req.session.user?.id || null;

    const isVolunteering = userId
      ? await getVolunteerStatus(projectId, userId)
      : false;

    res.render("project", {
      title: project.title,
      project,
      categories,
      isVolunteering,
      user: req.session.user || null
    });

  } catch (err) {
    next(err);
  }
};


// ------------------------------------------------------------
// NEW PROJECT FORM
// ------------------------------------------------------------
export const showNewProjectForm = async (req, res, next) => {
  try {
    const organizations = await getAllOrganizations();

    res.render("new-project", {
      title: "New Project",
      organizations,
      formValues: {}
    });

  } catch (err) {
    next(err);
  }
};


// ------------------------------------------------------------
// PROCESS CREATE PROJECT
// ------------------------------------------------------------
export const processNewProjectForm = async (req, res, next) => {
  try {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      const organizations = await getAllOrganizations();

      return res.status(400).render("new-project", {
        title: "New Project",
        errors: errors.array(),
        organizations,
        formValues: req.body
      });
    }

    const { title, description, location, date, organization_id } = req.body;

    await createProject(title, description, location, date, organization_id);

    res.redirect("/projects");

  } catch (err) {
    next(err);
  }
};


// ------------------------------------------------------------
// EDIT PROJECT 
// ------------------------------------------------------------
export const showEditProjectForm = async (req, res, next) => {
  try {
    const projectId = req.params.id;

    const project = await getProjectDetails(projectId);
    const organizations = await getAllOrganizations();

    if (!project) {
      return next(new Error("Project not found"));
    }

    res.render("edit-project", {
      title: "Edit Project",
      project,
      organizations,
      formValues: {
        title: project.title,
        description: project.description,
        location: project.location,
        date: project.date,
        organizationId: project.organization_id
      }
    });

  } catch (err) {
    next(err);
  }
};


// ------------------------------------------------------------
// PROCESS EDIT PROJECT (MATCHING FORM FIELD)
// ------------------------------------------------------------
export const processEditProjectForm = async (req, res, next) => {
  try {
    const { id } = req.params;

    const {
      title,
      description,
      location,
      date,
      organizationId
    } = req.body;

    await updateProject(
      id,
      title,
      description,
      location,
      date,
      organizationId
    );

    res.redirect(`/project/${id}`);

  } catch (err) {
    next(err);
  }
};


// ------------------------------------------------------------
// ORGANIZATION PROJECTS
// ------------------------------------------------------------
export const getProjectsByOrg = async (req, res, next) => {
  try {
    const projects = await getProjectsByOrganizationId(req.params.id);

    res.render("organization-projects", {
      title: "Organization Projects",
      projects
    });

  } catch (err) {
    next(err);
  }
};