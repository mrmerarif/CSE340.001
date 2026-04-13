import bcrypt from 'bcrypt';

import { 
    createUser, 
    authenticateUser, 
    getAllUsers 
} from '../models/users.js';

// ------------------------------------------------------
// FIXED IMPORT (case-sensitive path)
// ------------------------------------------------------
import { 
    getUserVolunteeredProjects 
} from '../models/projectvolunteers.js';


// ------------------------------------------------------
// Show Registration Form
// ------------------------------------------------------
const showUserRegistrationForm = (req, res) => {
    res.render('register', { title: 'Register' });
};


// ------------------------------------------------------
// Process Registration Form
// ------------------------------------------------------
const processUserRegistrationForm = async (req, res) => {
    const { name, email, password } = req.body;

    try {
        if (!name || !email || !password) {
            req.flash('error', 'All fields are required.');
            return res.redirect('/register');
        }

        if (name.length < 3 || name.length > 30) {
            req.flash('error', 'Username must be between 3 and 30 characters.');
            return res.redirect('/register');
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            req.flash('error', 'Please enter a valid email address.');
            return res.redirect('/register');
        }

        if (password.length < 8) {
            req.flash('error', 'Password must be at least 8 characters long.');
            return res.redirect('/register');
        }

        const salt = await bcrypt.genSalt(10);
        const passwordHash = await bcrypt.hash(password, salt);

        await createUser(name, email, passwordHash);

        req.flash('success', 'Registration successful! Please log in.');
        res.redirect('/');

    } catch (error) {
        console.error('Error registering user:', error);

        if (error.code === '23505') {
            if (error.detail && error.detail.includes('email')) {
                req.flash('error', 'That email is already registered.');
            } else if (error.detail && error.detail.includes('name')) {
                req.flash('error', 'That username is already taken.');
            } else {
                req.flash('error', 'Duplicate value detected.');
            }
            return res.redirect('/register');
        }

        req.flash('error', 'An error occurred during registration.');
        res.redirect('/register');
    }
};


// ------------------------------------------------------
// Show Login Form
// ------------------------------------------------------
const showLoginForm = (req, res) => {
    res.render('login', { title: 'Login' });
};


// ------------------------------------------------------
// Process Login Form
// ------------------------------------------------------
const processLoginForm = async (req, res) => {
    const { email, password } = req.body;

    try {
        const user = await authenticateUser(email, password);

        if (user) {
            req.session.user = user;

            req.flash('success', 'Login successful!');

            if (process.env.NODE_ENV === 'development') {
                console.log('User logged in:', user);
            }

            return res.redirect('/dashboard');
        } else {
            req.flash('error', 'Invalid email or password.');
            return res.redirect('/login');
        }

    } catch (error) {
        console.error('Error during login:', error);
        req.flash('error', 'An error occurred during login.');
        res.redirect('/login');
    }
};


// ------------------------------------------------------
// Process Logout
// ------------------------------------------------------
const processLogout = (req, res) => {
    if (req.session.user) {
        delete req.session.user;
    }

    req.flash('success', 'Logout successful!');
    res.redirect('/login');
};


// ------------------------------------------------------
// Require Login
// ------------------------------------------------------
const requireLogin = (req, res, next) => {
    if (!req.session || !req.session.user) {
        req.flash('error', 'You must be logged in.');
        return res.redirect('/login');
    }
    next();
};


// ------------------------------------------------------
// Require Role
// ------------------------------------------------------
const requireRole = (role) => {
    return (req, res, next) => {
        if (!req.session || !req.session.user) {
            req.flash('error', 'You must be logged in.');
            return res.redirect('/login');
        }

        if (req.session.user.role_name !== role) {
            req.flash('error', 'Access denied.');
            return res.redirect('/dashboard');
        }

        next();
    };
};


// ------------------------------------------------------
// DASHBOARD (Volunteer Feature)
// ------------------------------------------------------
const showDashboard = async (req, res) => {
    const user = req.session.user;

    const volunteeredProjects = await getUserVolunteeredProjects(user.id);

    res.render('dashboard', {
        title: 'Dashboard',
        name: user.name,
        email: user.email,
        volunteeredProjects
    });
};


// ------------------------------------------------------
// SHOW USERS (Admin)
// ------------------------------------------------------
const showUsersPage = async (req, res) => {
    try {
        const users = await getAllUsers();

        res.render('users', {
            title: 'All Registered Users',
            users
        });

    } catch (error) {
        console.error('Error loading users page:', error);
        req.flash('error', 'Unable to load users.');
        res.redirect('/dashboard');
    }
};


// ------------------------------------------------------
// EXPORTS
// ------------------------------------------------------
export {
    showUserRegistrationForm,
    processUserRegistrationForm,
    showLoginForm,
    processLoginForm,
    processLogout,
    requireLogin,
    requireRole,
    showDashboard,
    showUsersPage
};