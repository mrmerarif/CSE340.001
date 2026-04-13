import db from "./db.js";


export async function addVolunteer(projectId, userId) {
    const query = `
        INSERT INTO project_volunteers (project_id, user_id)
        VALUES ($1, $2)
        ON CONFLICT (project_id, user_id) DO NOTHING
        RETURNING *;
    `;
    const result = await db.query(query, [projectId, userId]);
    return result.rows[0];
}


export async function removeVolunteer(projectId, userId) {
    const query = `
        DELETE FROM project_volunteers
        WHERE project_id = $1 AND user_id = $2;
    `;
    await db.query(query, [projectId, userId]);
}

export async function isUserVolunteering(projectId, userId) {
    const query = `
        SELECT *
        FROM project_volunteers
        WHERE project_id = $1 AND user_id = $2;
    `;
    const result = await db.query(query, [projectId, userId]);
    return result.rows.length > 0;
}

export async function getUserVolunteeredProjects(userId) {
    const query = `
        SELECT p.project_id, p.title, p.description, p.location, p.date,
               o.name AS organization_name
        FROM project_volunteers pv
        JOIN project p ON pv.project_id = p.project_id
        JOIN organization o ON p.organization_id = o.organization_id
        WHERE pv.user_id = $1
        ORDER BY p.date ASC;
    `;
    const result = await db.query(query, [userId]);
    return result.rows;
}

export async function getVolunteerStatus(projectId, userId) {
    return await isUserVolunteering(projectId, userId);
}

export async function volunteerForProject(projectId, userId) {
    return await addVolunteer(projectId, userId);
}


export async function unvolunteerFromProject(projectId, userId) {
    return await removeVolunteer(projectId, userId);
}