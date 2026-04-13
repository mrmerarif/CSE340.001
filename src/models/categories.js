import db from './db.js';

// ------------------------------------------------------------
// MODEL: Categories
// ------------------------------------------------------------
// This file contains all database queries related to categories,
// including retrieving categories, retrieving categories for a
// project, retrieving projects for a category, and updating the
// many-to-many project_category table.
// ------------------------------------------------------------


// ------------------------------------------------------------
// Get ALL categories (used on /categories page)
// ------------------------------------------------------------
export const getAllCategories = async () => {
  const query = `
    SELECT category_id, name
    FROM category
    ORDER BY name;
  `;
  const result = await db.query(query);
  return result.rows;
};

// ------------------------------------------------------------
// Get ONE category by ID (used on /category/:id)
// ------------------------------------------------------------
export const getCategoryById = async (categoryId) => {
  const query = `
    SELECT category_id, name, description
    FROM category
    WHERE category_id = $1;
  `;
  const result = await db.query(query, [categoryId]);
  return result.rows[0];
};

// ------------------------------------------------------------
// NEW: Insert a NEW category
// ------------------------------------------------------------
// Used by the Create Category form.
// Throws an error if insertion fails.
// ------------------------------------------------------------
export const insertCategory = async (name) => {
  const query = `
    INSERT INTO category (name)
    VALUES ($1)
    RETURNING category_id, name;
  `;

  const result = await db.query(query, [name]);

  if (result.rows.length === 0) {
    throw new Error('Failed to insert category.');
  }

  return result.rows[0];
};

// ------------------------------------------------------------
// NEW: Update an existing category
// ------------------------------------------------------------
// Used by the Edit Category form.
// Throws an error if no rows are updated.
// ------------------------------------------------------------
export const updateCategory = async (categoryId, name) => {
  const query = `
    UPDATE category
    SET name = $1
    WHERE category_id = $2
    RETURNING category_id, name;
  `;

  const result = await db.query(query, [name, categoryId]);

  if (result.rows.length === 0) {
    throw new Error('Category not found or update failed.');
  }

  return result.rows[0];
};

// ------------------------------------------------------------
// Get ALL categories assigned to a project (used on /project/:id)
// ------------------------------------------------------------
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

// ------------------------------------------------------------
// Get ALL projects assigned to a category (used on /category/:id)
// ------------------------------------------------------------
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


// ------------------------------------------------------------
// INTERNAL HELPER: Assign ONE category to ONE project
// ------------------------------------------------------------
// This inserts a single row into the many-to-many table.
// Not exported because it is only used internally by
// updateCategoryAssignments.
// ------------------------------------------------------------
const assignCategoryToProject = async (projectId, categoryId) => {
  const query = `
    INSERT INTO project_category (project_id, category_id)
    VALUES ($1, $2);
  `;
  await db.query(query, [projectId, categoryId]);
};


// ------------------------------------------------------------
// UPDATE category
// ------------------------------------------------------------
// This function:
// 1. Deletes all existing category assignments for the project
// 2. Re-adds the selected category IDs
//
// Used by the Assign Categories form.
// ------------------------------------------------------------
export const updateCategoryAssignments = async (projectId, categoryIds) => {

  // Step 1: Remove all existing assignments
  const deleteQuery = `
    DELETE FROM project_category
    WHERE project_id = $1;
  `;
  await db.query(deleteQuery, [projectId]);

  // Step 2: Add new assignments
  for (const categoryId of categoryIds) {
    await assignCategoryToProject(projectId, categoryId);
  }
};
