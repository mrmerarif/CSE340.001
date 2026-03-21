// Import model
import { getAllOrganizations } from '../models/organizations.js';

// Define controller function
const showOrganizationsPage = async (req, res) => {
    const organizations = await getAllOrganizations();
    const title = 'Our Partner Organizations';
    res.render('organizations', { title, organizations });
};

// Export controller
export { showOrganizationsPage };
