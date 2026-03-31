// ------------------------------------------------------------
// CONTROLLER: Organizations
// ------------------------------------------------------------
// This file contains all controller functions related to
// displaying organizations, showing organization details,
// rendering the "new organization" form, and processing
// form submissions to create or update an organization.
// ------------------------------------------------------------

import { 
    getAllOrganizations,
    getOrganizationDetails,
    updateOrganization
} from '../models/organizations.js';

import { createOrganization } from '../models/organization.js';
import { getProjectsByOrganizationId } from '../models/projects.js';
import { body, validationResult } from 'express-validator';

// ------------------------------------------------------------
// Validation rules
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
// Show list of organizations
// ------------------------------------------------------------
const showOrganizationsPage = async (req, res) => {
    const organizations = await getAllOrganizations();
    res.render('organizations', { title: 'Our Partner Organizations', organizations });
};

// ------------------------------------------------------------
// Show organization details
// ------------------------------------------------------------
const showOrganizationDetailsPage = async (req, res) => {
    const organizationId = req.params.id;
    const organizationDetails = await getOrganizationDetails(organizationId);
    const projects = await getProjectsByOrganizationId(organizationId);

    res.render('organization', { 
        title: 'Organization Details', 
        organizationDetails, 
        projects 
    });
};

// ------------------------------------------------------------
// Show NEW organization form
// ------------------------------------------------------------
const showNewOrganizationForm = async (req, res) => {
    res.render('new-organization', { 
        title: 'Add New Organization',
        errors: [],
        values: {}
    });
};

// ------------------------------------------------------------
// Process NEW organization form
// ------------------------------------------------------------
const processNewOrganizationForm = async (req, res) => {
    const results = validationResult(req);
    const { name, description, contactEmail } = req.body;

    if (!results.isEmpty()) {
        return res.render('new-organization', {
            title: 'Add New Organization',
            errors: results.array(),
            values: { name, description, contactEmail }
        });
    }

    const logoFilename = 'placeholder-logo.png';

    const organizationId = await createOrganization(
        name,
        description,
        contactEmail,
        logoFilename
    );

    req.flash('success', 'Organization added successfully!');
    res.redirect(`/organization/${organizationId}`);
};

// ------------------------------------------------------------
// Show EDIT organization form
// ------------------------------------------------------------
const showEditOrganizationForm = async (req, res) => {
    const organizationId = req.params.id;
    const organizationDetails = await getOrganizationDetails(organizationId);

    res.render('edit-organization', { 
        title: 'Edit Organization',
        errors: [],
        values: {
            name: organizationDetails.name,
            description: organizationDetails.description,
            contactEmail: organizationDetails.contact_email   // FIXED
        },
        organizationDetails
    });
};

// ------------------------------------------------------------
// Process EDIT organization form
// ------------------------------------------------------------
const processEditOrganizationForm = async (req, res) => {
    const results = validationResult(req);
    const organizationId = req.params.id;
    const { name, description, contactEmail } = req.body;

    // FIX: Always provide a logo filename
    const logoFilename = 'placeholder-logo.png';

    if (!results.isEmpty()) {
        return res.render('edit-organization', {
            title: 'Edit Organization',
            errors: results.array(),
            values: { name, description, contactEmail },
            organizationDetails: { organization_id: organizationId }
        });
    }

    await updateOrganization(
        organizationId,
        name,
        description,
        contactEmail,
        logoFilename   // FIXED
    );

    req.flash('success', 'Organization updated successfully!');
    res.redirect(`/organization/${organizationId}`);
};

export {
    showOrganizationsPage,
    showOrganizationDetailsPage,
    showNewOrganizationForm,
    processNewOrganizationForm,
    organizationValidation,
    showEditOrganizationForm,
    processEditOrganizationForm
};
