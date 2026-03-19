import db from './db.js';

export const getAllCategories = async () => {
  const query = `
    SELECT category_id, name
    FROM category
    ORDER BY name;
  `;
  const result = await db.query(query);
  return result.rows;
};
