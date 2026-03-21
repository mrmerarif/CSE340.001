// Import model functions
import { 
  getAllCategories, 
  getCategoryById, 
  getProjectsByCategoryId 
} from '../models/categories.js';

// Controller: Show categories list page (/categories)
const showCategoriesPage = async (req, res, next) => {
  try {
    const categories = await getAllCategories();
    const title = 'Categories';
    res.render('categories', { title, categories });
  } catch (err) {
    next(err);
  }
};

// Controller: Show category details page (/category/:id)
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

// Export controllers
export { showCategoriesPage, showCategoryDetailsPage };
