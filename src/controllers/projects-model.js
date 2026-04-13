// ------------------------------------------------------------
// Database connection
// ------------------------------------------------------------
import pkg from 'pg';
const { Pool } = pkg;

// 🔧 Update with your actual DB connection info
const pool = new Pool({
  connectionString: process.env.DATABASE_URL
});


// ------------------------------------------------------------
// Get project details by ID
// ------------------------------------------------------------
export async function getProjectDetails(projectId) {
  const result = await pool.query(
    `SELECT p.*, o.name AS organization_name
     FROM projects p
     JOIN organizations o 
       ON p.organization_id = o.organization_id
     WHERE p.project_id = $1`,
    [projectId]
  );

  return result.rows[0];
}


// ------------------------------------------------------------
// Get categories for a project
// ------------------------------------------------------------
export async function getCategoriesByProjectId(projectId) {
  const result = await pool.query(
    `SELECT c.category_id, c.name
     FROM categories c
     JOIN project_categories pc 
       ON c.category_id = pc.category_id
     WHERE pc.project_id = $1`,
    [projectId]
  );

  return result.rows;
}



export async function getProjectsByOrganizationId(organizationId) {
  const result = await pool.query(
    `SELECT *
     FROM projects
     WHERE organization_id = $1
     ORDER BY date ASC`,
    [organizationId]
  );

  return result.rows;
}