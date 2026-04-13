import { 
    getAllOrganizations,
    getOrganizationDetails,
    updateOrganization,
    createOrganization
} from '../models/organizations.js';

import { getProjectsByOrganizationId } from '../models/projects.js';
import { body, validationResult } from 'express-validator';


// ------------------------------------------------------------
// VALIDATION
// ------------------------------------------------------------
export const organizationValidation = [
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
// SHOW ALL ORGANIZATIONS
// ------------------------------------------------------------
export const showOrganizationsPage = async (req, res) => {
    const organizations = await getAllOrganizations();

    res.render('organizations', {
        title: 'Our Partner Organizations',
        organizations
    });
};


// ------------------------------------------------------------
// SHOW ORGANIZATION DETAILS
// ------------------------------------------------------------
export const showOrganizationDetailsPage = async (req, res) => {
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
// NEW ORGANIZATION FORM
// ------------------------------------------------------------
export const showNewOrganizationForm = (req, res) => {
    res.render('new-organization', {
        title: 'Add New Organization',
        errors: [],
        values: {}
    });
};


// ------------------------------------------------------------
// PROCESS NEW ORGANIZATION
// ------------------------------------------------------------
export const processNewOrganizationForm = async (req, res) => {
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
// EDIT ORGANIZATION FORM
// ------------------------------------------------------------
export const showEditOrganizationForm = async (req, res) => {
    const organizationId = req.params.id;
    const organizationDetails = await getOrganizationDetails(organizationId);

    res.render('edit-organization', {
        title: 'Edit Organization',
        errors: [],
        values: {
            name: organizationDetails.name,
            description: organizationDetails.description,
            contactEmail: organizationDetails.contact_email
        },
        organizationDetails
    });
};


// ------------------------------------------------------------
// PROCESS EDIT ORGANIZATION
// ------------------------------------------------------------
export const processEditOrganizationForm = async (req, res) => {
    const results = validationResult(req);
    const organizationId = req.params.id;
    const { name, description, contactEmail } = req.body;

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
        logoFilename
    );

    req.flash('success', 'Organization updated successfully!');
    res.redirect(`/organization/${organizationId}`);
};