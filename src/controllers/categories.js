// ------------------------------------------------------------
// CONTROLLER: Categories
// ------------------------------------------------------------
// This file handles:
// - Listing all categories
// - Showing category details
// - Creating new categories
// - Editing existing categories
// - Showing the Assign Categories form for a project
// - Processing category assignment updates
// ------------------------------------------------------------

import {
  getAllCategories,
  getCategoryById,
  getProjectsByCategoryId,
  getCategoriesByProjectId,
  updateCategoryAssignments,
  insertCategory,          // <-- NEW
  updateCategory           // <-- NEW
} from '../models/categories.js';

import { getProjectDetails } from '../models/projects.js';

// Validation library
import { body, validationResult } from 'express-validator';


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
// NEW: Show Create Category form (/new-category)
// ------------------------------------------------------------
const showNewCategoryForm = (req, res) => {
  const title = 'Create New Category';
  res.render('new-category', { title, errors: [], values: {} });
};


// ------------------------------------------------------------
// NEW: Process Create Category form (POST /new-category)
// ------------------------------------------------------------
const createCategoryValidation = [
  body('name')
    .trim()
    .notEmpty().withMessage('Category name is required.')
    .isLength({ max: 100 }).withMessage('Category name must be 100 characters or fewer.')
    // NOTE: min length NOT added here (client-side test)
];

const processNewCategoryForm = async (req, res, next) => {
  const errors = validationResult(req);
  const { name } = req.body;

  // Server-side min length validation (assignment requirement)
  if (name.trim().length < 3) {
    errors.errors.push({
      msg: 'Category name must be at least 3 characters.',
      param: 'name'
    });
  }

  if (!errors.isEmpty()) {
    const title = 'Create New Category';
    return res.render('new-category', {
      title,
      errors: errors.array(),
      values: { name }
    });
  }

  try {
    await insertCategory(name.trim());
    req.flash('success', 'Category created successfully.');
    res.redirect('/categories');
  } catch (err) {
    next(err);
  }
};


// ------------------------------------------------------------
// NEW: Show Edit Category form (/edit-category/:id)
// ------------------------------------------------------------
const showEditCategoryForm = async (req, res, next) => {
  try {
    const categoryId = req.params.id;
    const category = await getCategoryById(categoryId);

    if (!category) {
      const err = new Error('Category not found');
      err.status = 404;
      return next(err);
    }

    const title = 'Edit Category';

    res.render('edit-category', {
      title,
      errors: [],
      values: { name: category.name },
      categoryId
    });

  } catch (err) {
    next(err);
  }
};


// ------------------------------------------------------------
// NEW: Process Edit Category form (POST /edit-category/:id)
// ------------------------------------------------------------
const editCategoryValidation = [
  body('name')
    .trim()
    .notEmpty().withMessage('Category name is required.')
    .isLength({ max: 100 }).withMessage('Category name must be 100 characters or fewer.')
];

const processEditCategoryForm = async (req, res, next) => {
  const errors = validationResult(req);
  const categoryId = req.params.id;
  const { name } = req.body;

  // Server-side min length validation
  if (name.trim().length < 3) {
    errors.errors.push({
      msg: 'Category name must be at least 3 characters.',
      param: 'name'
    });
  }

  if (!errors.isEmpty()) {
    const title = 'Edit Category';
    return res.render('edit-category', {
      title,
      errors: errors.array(),
      values: { name },
      categoryId
    });
  }

  try {
    await updateCategory(categoryId, name.trim());
    req.flash('success', 'Category updated successfully.');
    res.redirect(`/category/${categoryId}`);
  } catch (err) {
    next(err);
  }
};


// ------------------------------------------------------------
// Assign Categories to Project (existing)
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

const processAssignCategoriesForm = async (req, res, next) => {
  try {
    const projectId = req.params.projectId;

    const selectedCategoryIds = req.body.categoryIds || [];
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

  // NEW: Create Category
  showNewCategoryForm,
  createCategoryValidation,
  processNewCategoryForm,

  // NEW: Edit Category
  showEditCategoryForm,
  editCategoryValidation,
  processEditCategoryForm,

  // Existing
  showAssignCategoriesForm,
  processAssignCategoriesForm
};
