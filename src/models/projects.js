// ------------------------------------------------------------
// MODEL: Projects
// ------------------------------------------------------------
// This file contains all database queries related to the
// "project" table. Each function here communicates directly
// with PostgreSQL and returns raw data to the controller layer.
// ------------------------------------------------------------

import db from './db.js';

// ------------------------------------------------------------
// Get ALL projects (with organization name)
// ------------------------------------------------------------
export const getAllProjects = async () => {
  const query = `
    SELECT p.*, o.name AS organization_name
    FROM project p
    JOIN organization o ON p.organization_id = o.organization_id
    ORDER BY p.date;
  `;
  const result = await db.query(query);
  return result.rows;
};

// ------------------------------------------------------------
// Get UPCOMING projects (limit by number)
// ------------------------------------------------------------
export const getUpcomingProjects = async (number_of_projects) => {
  const query = `
    SELECT p.project_id, p.title, p.description, p.date, p.location,
           o.organization_id, o.name AS organization_name
    FROM project p
    JOIN organization o ON p.organization_id = o.organization_id
    WHERE p.date >= CURRENT_DATE
    ORDER BY p.date ASC
    LIMIT $1;
  `;
  const result = await db.query(query, [number_of_projects]);
  return result.rows;
};

// ------------------------------------------------------------
// Get ONE project by ID (with organization name)
// ------------------------------------------------------------
export const getProjectDetails = async (id) => {
  const query = `
    SELECT p.project_id, p.title, p.description, p.date, p.location,
           o.organization_id, o.name AS organization_name
    FROM project p
    JOIN organization o ON p.organization_id = o.organization_id
    WHERE p.project_id = $1;
  `;
  const result = await db.query(query, [id]);
  return result.rows[0];
};

// ------------------------------------------------------------
// Get ALL projects for a specific organization
// ------------------------------------------------------------
export const getProjectsByOrganizationId = async (organizationId) => {
  const query = `
    SELECT
      project_id,
      organization_id,
      title,
      description,
      location,
      date
    FROM project
    WHERE organization_id = $1
    ORDER BY date;
  `;
  
  const query_params = [organizationId];
  const result = await db.query(query, query_params);

  return result.rows;
};

// ------------------------------------------------------------
// CREATE a new service project
// ------------------------------------------------------------
// Inserts a new project into the database and returns the new ID.
// Used by the "New Project" form submission.
// ------------------------------------------------------------
export const createProject = async (title, description, location, date, organizationId) => {
  const query = `
    INSERT INTO project (title, description, location, date, organization_id)
    VALUES ($1, $2, $3, $4, $5)
    RETURNING project_id;
  `;

  const params = [title, description, location, date, organizationId];
  const result = await db.query(query, params);

  if (result.rows.length === 0) {
    throw new Error('Failed to create project');
  }

  return result.rows[0].project_id;
};
