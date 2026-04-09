-- ========================================
-- Organization Table
-- ========================================
CREATE TABLE organization (
    organization_id SERIAL PRIMARY KEY,
    name VARCHAR(150) NOT NULL,
    description TEXT NOT NULL,
    contact_email VARCHAR(255) NOT NULL,
    logo_filename VARCHAR(255) NOT NULL
);

-- ========================================
-- Insert sample data: Organizations
-- ========================================
INSERT INTO organization (name, description, contact_email, logo_filename)
VALUES
('BrightFuture Builders', 'A nonprofit focused on improving community infrastructure through sustainable construction projects.', 'info@brightfuturebuilders.org', 'brightfuture-logo.png'),
('GreenHarvest Growers', 'An urban farming collective promoting food sustainability and education in local neighborhoods.', 'contact@greenharvest.org', 'greenharvest-logo.png'),
('UnityServe Volunteers', 'A volunteer coordination group supporting local charities and service initiatives.', 'hello@unityserve.org', 'unityserve-logo.png');


-- ================================================
-- Project Table
-- ================================================
CREATE TABLE project (
    project_id SERIAL PRIMARY KEY,
    organization_id INT NOT NULL,
    title VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    location VARCHAR(255) NOT NULL,
    date DATE NOT NULL,
    CONSTRAINT fk_project_organization
        FOREIGN KEY (organization_id)
        REFERENCES organization(organization_id)
        ON DELETE CASCADE
);


-- ================================================
-- Insert sample data: Projects
-- ================================================
INSERT INTO project (organization_id, title, description, location, date) VALUES
(1, 'Park Cleanup', 'Join us to clean up local parks and make them beautiful!', 'City Park', '2025-04-10'),
(1, 'Riverbank Restoration', 'Help restore and protect the local riverbank ecosystem.', 'Riverside Trail', '2025-04-17'),
(1, 'Playground Repair', 'Repair and refresh playground equipment for kids.', 'Maple Grove Playground', '2025-04-24'),
(1, 'Community Garden Build', 'Build raised beds and plant vegetables for the community.', 'Sunrise Community Garden', '2025-05-01'),
(1, 'Neighborhood Mural Project', 'Paint a mural to brighten a public space.', 'Downtown Alleyway', '2025-05-08'),

(2, 'Food Drive', 'Help collect and distribute food to those in need.', 'Community Food Bank', '2025-04-12'),
(2, 'Farm Volunteer Day', 'Assist with planting, weeding, and harvesting at the urban farm.', 'GreenHarvest Farm', '2025-04-19'),
(2, 'Farmers Market Booth', 'Support the farm by helping at the market booth.', 'City Farmers Market', '2025-04-26'),
(2, 'Composting Workshop', 'Teach families how to compost at home.', 'Community Center', '2025-05-03'),
(2, 'Seedling Giveaway', 'Distribute seedlings and teach basic gardening skills.', 'Library Courtyard', '2025-05-10'),

(3, 'Community Tutoring', 'Volunteer to tutor students in various subjects.', 'Unity Learning Center', '2025-04-15'),
(3, 'Senior Tech Help', 'Help seniors learn how to use phones and computers.', 'Sunrise Senior Center', '2025-04-22'),
(3, 'Charity 5K Volunteers', 'Support a local charity race with setup and cleanup.', 'City Stadium', '2025-04-29'),
(3, 'Clothing Drive Sorting', 'Sort and organize donated clothing for families.', 'UnityServe Warehouse', '2025-05-06'),
(3, 'Family Game Night', 'Host games and activities for families in need of a fun night out.', 'Community Gym', '2025-05-13');


-- Create category table
CREATE TABLE category (
    category_id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL UNIQUE
);

-- Create join table for many-to-many relationship
CREATE TABLE project_category (
    project_id INT NOT NULL,
    category_id INT NOT NULL,
    PRIMARY KEY (project_id, category_id),
    FOREIGN KEY (project_id) REFERENCES project(project_id),
    FOREIGN KEY (category_id) REFERENCES category(category_id)
);

-- Insert categories
INSERT INTO category (name) VALUES
('Community Service'),
('Education'),
('Environment');


-- Associate each project with at least one category
INSERT INTO project_category (project_id, category_id) VALUES
(1, 1),
(2, 2),
(3, 3),
(4, 1),
(5, 2),
(6, 3),
(7, 1),
(8, 2),
(9, 3),
(10, 1),
(11, 2),
(12, 3),
(13, 1),
(14, 2),
(15, 3);


-- Created users table with role_id as a foreign key referencing the roles table
CREATE TABLE users (
    user_id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    role_id INTEGER REFERENCES roles(role_id),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

