// ------------------------------------------------------------
// CONTROLLER: Organizations
// ------------------------------------------------------------
// This file contains all controller functions related to
// displaying organizations, showing organization details,
// rendering the "new organization" form, and processing
// form submissions to create or update an organization.
// ------------------------------------------------------------

// Import model functions that interact with the database
import { 
    getAllOrganizations,          // Fetch all organizations
    getOrganizationDetails,       // Fetch a single organization by ID
    updateOrganization            // <-- NEW: Update an existing organization
} from '../models/organizations.js';   // <-- plural file for GET + UPDATE functions

import { 
    createOrganization            // Insert a new organization into the DB
} from '../models/organization.js';    // <-- singular file for CREATE function

import { 
    getProjectsByOrganizationId   // Fetch all projects for a given organization
} from '../models/projects.js';

// Import validation tools
import { body, validationResult } from 'express-validator';

// ------------------------------------------------------------
// Validation + sanitization rules for the New/Edit Organization form
// ------------------------------------------------------------
const organizationValidation = [
    body('name')
        .trim()
        .notEmpty().withMessage('Organization name is required')
        .isLength({ min: 3, max: 150 })
        .withMessage('Organization name must be between 3 and 150 characters'),

    body('description')
        .trim()
        .notEmpty().withMessage('Organization description is required')
        .isLength({ max: 500 })
        .withMessage('Organization description cannot exceed 500 characters'),

    body('contactEmail')
        .normalizeEmail()
        .notEmpty().withMessage('Contact email is required')
        .isEmail().withMessage('Please provide a valid email address')
];


// ------------------------------------------------------------
// Controller: Show list of all organizations
// ------------------------------------------------------------
const showOrganizationsPage = async (req, res) => {
    const organizations = await getAllOrganizations();
    const title = 'Our Partner Organizations';

    res.render('organizations', { title, organizations });
};


// ------------------------------------------------------------
// Controller: Show details for a single organization
// ------------------------------------------------------------
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
const showNewOrganizationForm = async (req, res) => {
    const title = 'Add New Organization';

    res.render('new-organization', { title });
};


// ------------------------------------------------------------
// Controller: Process the "New Organization" form submission
// ------------------------------------------------------------
const processNewOrganizationForm = async (req, res) => {

    // Check for validation errors
    const results = validationResult(req);

    if (!results.isEmpty()) {
        // Loop through each validation error and flash it
        results.array().forEach(error => {
            req.flash('error', error.msg);
        });

        // Redirect back to the form
        return res.redirect('/new-organization');
    }

    // No validation errors → proceed normally
    const { name, description, contactEmail } = req.body;
    const logoFilename = 'placeholder-logo.png';

    const organizationId = await createOrganization(
        name,
        description,
        contactEmail,
        logoFilename
    );

    // Add success flash message
    req.flash('success', 'Organization added successfully!');

    res.redirect(`/organization/${organizationId}`);
};


// ------------------------------------------------------------
// Controller: Show the "Edit Organization" form
// ------------------------------------------------------------
// NOTE: This must NOT be inside another function.
const showEditOrganizationForm = async (req, res) => {
    const organizationId = req.params.id;
    const organizationDetails = await getOrganizationDetails(organizationId);

    const title = 'Edit Organization';
    res.render('edit-organization', { title, organizationDetails });
};


// ------------------------------------------------------------
// Controller: Process the "Edit Organization" form submission
// ------------------------------------------------------------
const processEditOrganizationForm = async (req, res) => {

    // Check for validation errors
    const results = validationResult(req);

    if (!results.isEmpty()) {
        results.array().forEach(error => {
            req.flash('error', error.msg);
        });

        return res.redirect('/edit-organization/' + req.params.id);
    }

    // No validation errors → proceed
    const organizationId = req.params.id;
    const { name, description, contactEmail, logoFilename } = req.body;

    await updateOrganization(
        organizationId,
        name,
        description,
        contactEmail,
        logoFilename
    );

    // Flash success message
    req.flash('success', 'Organization updated successfully!');

    res.redirect(`/organization/${organizationId}`);
};


// ------------------------------------------------------------
// Export all controllers so routes.js can use them
// ------------------------------------------------------------
export {
    showOrganizationsPage,
    showOrganizationDetailsPage,
    showNewOrganizationForm,
    processNewOrganizationForm,
    organizationValidation,
    showEditOrganizationForm,       // <-- now correctly defined
    processEditOrganizationForm     // <-- now correctly defined
};
