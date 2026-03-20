import db from './db.js';

// Existing function
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

// NEW: Get upcoming projects (limit by number)
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

// NEW: Get details for a single project
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
