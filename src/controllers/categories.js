// Import model
import { getAllCategories } from '../models/categories.js';

// Define controller function
const showCategoriesPage = async (req, res) => {
    const categories = await getAllCategories();
    const title = 'Categories';
    res.render('categories', { title, categories });
};

// Export controller
export { showCategoriesPage };
