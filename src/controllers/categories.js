// ------------------------------------------------------------
// CONTROLLER: Categories
// ------------------------------------------------------------
// This file handles:
// - Listing all categories
// - Showing category details
// - Showing the Assign Categories form for a project
// - Processing category assignment updates
// ------------------------------------------------------------

// Existing imports
import { 
  getAllCategories, 
  getCategoryById, 
  getProjectsByCategoryId,
  getCategoriesByProjectId,          // <-- NEW: Needed for assigned categories
  updateCategoryAssignments           // <-- NEW: Needed to save assignments
} from '../models/categories.js';

import { getProjectDetails } from '../models/projects.js'; // <-- NEW: Needed to show project info


// ------------------------------------------------------------
// Show categories list page (/categories)
// ------------------------------------------------------------
const showCategoriesPage = async (req, res, next) => {
  try {
    const categories = await getAllCategories();
    const title = 'Categories';
    res.render('categories', { title, categories });
  } catch (err) {
    next(err);
  }
};


// ------------------------------------------------------------
// Show category details page (/category/:id)
// ------------------------------------------------------------
const showCategoryDetailsPage = async (req, res, next) => {
  try {
    const categoryId = req.params.id;

    const category = await getCategoryById(categoryId);
    const projects = await getProjectsByCategoryId(categoryId);

    const title = category ? category.name : 'Category';

    res.render('category', { title, category, projects });
  } catch (err) {
    next(err);
  }
};


// ------------------------------------------------------------
// NEW: Show Assign Categories form (/assign-categories/:projectId)
// ------------------------------------------------------------
// Loads:
// - Project details
// - All categories
// - Categories currently assigned to the project
// ------------------------------------------------------------
const showAssignCategoriesForm = async (req, res, next) => {
  try {
    const projectId = req.params.projectId;

    const projectDetails = await getProjectDetails(projectId);
    const categories = await getAllCategories();
    const assignedCategories = await getCategoriesByProjectId(projectId);

    const title = 'Assign Categories to Project';

    res.render('assign-categories', { 
      title, 
      projectId, 
      projectDetails, 
      categories, 
      assignedCategories 
    });

  } catch (err) {
    next(err);
  }
};


// ------------------------------------------------------------
// NEW: Process Assign Categories form (POST)
// ------------------------------------------------------------
// Saves the updated list of category IDs for the project
// ------------------------------------------------------------
const processAssignCategoriesForm = async (req, res, next) => {
  try {
    const projectId = req.params.projectId;

    // Form field name: categoryIds
    const selectedCategoryIds = req.body.categoryIds || [];

    // Ensure it's always an array
    const categoryIdsArray = Array.isArray(selectedCategoryIds)
      ? selectedCategoryIds
      : [selectedCategoryIds];

    await updateCategoryAssignments(projectId, categoryIdsArray);

    req.flash('success', 'Categories updated successfully.');
    res.redirect(`/project/${projectId}`);

  } catch (err) {
    next(err);
  }
};


// ------------------------------------------------------------
// Export controllers
// ------------------------------------------------------------
export { 
  showCategoriesPage, 
  showCategoryDetailsPage,
  showAssignCategoriesForm,        // <-- NEW
  processAssignCategoriesForm      // <-- NEW
};
