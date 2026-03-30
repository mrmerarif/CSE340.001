// ------------------------------------------------------------
// CONTROLLER: Organizations
// ------------------------------------------------------------
// This file contains all controller functions related to
// displaying organizations, showing organization details,
// rendering the "new organization" form, and processing
// form submissions to create a new organization.
// ------------------------------------------------------------

// Import model functions that interact with the database
import { 
    getAllOrganizations,          // Fetch all organizations
    getOrganizationDetails        // Fetch a single organization by ID
} from '../models/organizations.js';   // <-- plural file for GET functions

import { 
    createOrganization            // Insert a new organization into the DB
} from '../models/organization.js';    // <-- singular file for CREATE function

import { 
    getProjectsByOrganizationId   // Fetch all projects for a given organization
} from '../models/projects.js';


// ------------------------------------------------------------
// Controller: Show list of all organizations
// ------------------------------------------------------------
// This controller retrieves all organizations from the database
// and renders the organizations.ejs view.
const showOrganizationsPage = async (req, res) => {
    const organizations = await getAllOrganizations();
    const title = 'Our Partner Organizations';

    res.render('organizations', { title, organizations });
};


// ------------------------------------------------------------
// Controller: Show details for a single organization
// ------------------------------------------------------------
// This controller retrieves:
// 1. The organization details
// 2. All projects belonging to that organization
// Then renders the organization.ejs view.
const showOrganizationDetailsPage = async (req, res) => {
    const organizationId = req.params.id;

    const organizationDetails = await getOrganizationDetails(organizationId);
    const projects = await getProjectsByOrganizationId(organizationId);

    const title = 'Organization Details';

    res.render('organization', { title, organizationDetails, projects });
};


// ------------------------------------------------------------
// Controller: Show the "New Organization" form
// ------------------------------------------------------------
// This controller simply renders the form where users can
// enter information to create a new organization.
const showNewOrganizationForm = async (req, res) => {
    const title = 'Add New Organization';

    res.render('new-organization', { title });
};


// ------------------------------------------------------------
// Controller: Process the "New Organization" form submission
// ------------------------------------------------------------
// This controller receives form data from req.body,
// sends it to the model to insert into the database,
// and then redirects the user to the new organization's
// details page.
const processNewOrganizationForm = async (req, res) => {
    const { name, description, contactEmail } = req.body;

    try {
        const logoFilename = 'placeholder-logo.png';

        const organizationId = await createOrganization(
            name,
            description,
            contactEmail,
            logoFilename
        );

        res.redirect(`/organization/${organizationId}`);

    } catch (error) {
        console.error("Error creating organization:", error);

        // Render the 500 error page if something goes wrong
        res.status(500).render("errors/500");
    }
};


// ------------------------------------------------------------
// Export all controllers so routes.js can use them
// ------------------------------------------------------------
export { 
    showOrganizationsPage, 
    showOrganizationDetailsPage,
    showNewOrganizationForm,
    processNewOrganizationForm
};
