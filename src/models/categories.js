import db from './db.js';

// Get all categories (used on /categories page)
export const getAllCategories = async () => {
  const query = `
    SELECT category_id, name
    FROM category
    ORDER BY name;
  `;
  const result = await db.query(query);
  return result.rows;
};

// Get a single category by ID (used on /category/:id)
export const getCategoryById = async (categoryId) => {
  const query = `
    SELECT category_id, name, description
    FROM category
    WHERE category_id = $1;
  `;
  const result = await db.query(query, [categoryId]);
  return result.rows[0];
};

// Get all categories for a given project (used on /project/:id)
export const getCategoriesByProjectId = async (projectId) => {
  const query = `
    SELECT c.category_id, c.name
    FROM category c
    JOIN project_category pc
      ON c.category_id = pc.category_id
    WHERE pc.project_id = $1
    ORDER BY c.name;
  `;
  const result = await db.query(query, [projectId]);
  return result.rows;
};

// Get all projects for a given category (used on /category/:id)
export const getProjectsByCategoryId = async (categoryId) => {
  const query = `
    SELECT 
      p.project_id,
      p.title,
      p.date,
      p.location,
      o.organization_id,
      o.name AS organization_name
    FROM project p
    JOIN project_category pc
      ON p.project_id = pc.project_id
    JOIN organization o
      ON p.organization_id = o.organization_id
    WHERE pc.category_id = $1
    ORDER BY p.date;
  `;
  const result = await db.query(query, [categoryId]);
  return result.rows;
};
