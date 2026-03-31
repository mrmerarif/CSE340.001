// ------------------------------------------------------------
// MODEL: Organizations
// ------------------------------------------------------------
// This file contains all database queries related to the
// "organization" table. Each function here communicates
// directly with PostgreSQL and returns raw data to the
// controller layer.
// ------------------------------------------------------------

import db from './db.js';

// ------------------------------------------------------------
// Get ALL organizations
// ------------------------------------------------------------
const getAllOrganizations = async () => {
    const query = `
        SELECT 
            organization_id, 
            name, 
            description, 
            contact_email, 
            logo_filename
        FROM public.organization
        ORDER BY name;
    `;

    const result = await db.query(query);
    return result.rows;
};

// ------------------------------------------------------------
// Get ONE organization by ID
// ------------------------------------------------------------
const getOrganizationDetails = async (organizationId) => {
    const query = `
        SELECT
            organization_id,
            name,
            description,
            contact_email,
            logo_filename
        FROM organization
        WHERE organization_id = $1;
    `;

    const result = await db.query(query, [organizationId]);
    return result.rows.length > 0 ? result.rows[0] : null;
};

// ------------------------------------------------------------
// Update an existing organization
// ------------------------------------------------------------
const updateOrganization = async (organizationId, name, description, contactEmail, logoFilename) => {
    const query = `
      UPDATE organization
      SET name = $1, description = $2, contact_email = $3, logo_filename = $4
      WHERE organization_id = $5
      RETURNING organization_id;
    `;
  
    const params = [name, description, contactEmail, logoFilename, organizationId];
    const result = await db.query(query, params);
  
    if (result.rows.length === 0) {
      throw new Error('Organization not found');
    }
  
    return result.rows[0].organization_id;
};

export {
    getAllOrganizations,
    getOrganizationDetails,
    updateOrganization
};
