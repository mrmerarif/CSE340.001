// No model imports needed for the home page

// Define controller function
const showHomePage = async (req, res) => {
    const title = 'Home';
    res.render('home', { title });
};

// Export controller
export { showHomePage };
