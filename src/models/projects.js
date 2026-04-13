import db from "./db.js";

// -----------------------------
// GET ALL PROJECTS
// -----------------------------
export async function getAllProjects() {
  const result = await db.query(
    `SELECT p.*, o.name AS organization_name
     FROM project p
     JOIN organization o ON p.organization_id = o.organization_id
     ORDER BY p.date ASC`
  );
  return result.rows;
}

// -----------------------------
// GET PROJECT DETAILS
// -----------------------------
export async function getProjectDetails(projectId) {
  const result = await db.query(
    `SELECT p.*, o.name AS organization_name
     FROM project p
     JOIN organization o ON p.organization_id = o.organization_id
     WHERE p.project_id = $1`,
    [projectId]
  );
  return result.rows[0];
}

// -----------------------------
// GET PROJECTS BY ORG
// -----------------------------
export async function getProjectsByOrganizationId(orgId) {
  const result = await db.query(
    `SELECT * FROM project
     WHERE organization_id = $1
     ORDER BY date ASC`,
    [orgId]
  );
  return result.rows;
}

// -----------------------------
// CREATE PROJECT
// -----------------------------
export async function createProject(title, description, location, date, organizationId) {
  const result = await db.query(
    `INSERT INTO project (title, description, location, date, organization_id)
     VALUES ($1,$2,$3,$4,$5)
     RETURNING project_id`,
    [title, description, location, date, organizationId]
  );
  return result.rows[0].project_id;
}

// -----------------------------
// UPDATE PROJECT
// -----------------------------
export async function updateProject(projectId, title, description, location, date, organizationId) {
  await db.query(
    `UPDATE project
     SET title=$1, description=$2, location=$3, date=$4, organization_id=$5
     WHERE project_id=$6`,
    [title, description, location, date, organizationId, projectId]
  );
}