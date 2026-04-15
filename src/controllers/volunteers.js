import {
  addVolunteer,
  removeVolunteer,
  isUserVolunteering,
  getUserVolunteeredProjects,
  getVolunteerStatus
} from "../models/projectVolunteers.js";



// ------------------------------------------------------------
// Add logged-in user as volunteer for a project
// ------------------------------------------------------------
export const volunteerForProject = async (req, res) => {
  const projectId = req.params.id;

  // support both id formats
  const userId = req.session.user?.user_id || req.session.user?.id;

  if (!userId) {
    req.flash("error", "You must be logged in to volunteer.");
    return res.redirect(`/project/${projectId}`);
  }

  try {
    await addVolunteer(projectId, userId);

    req.flash("success", "You are now volunteering for this project!");
    res.redirect(`/project/${projectId}`);
  } catch (err) {
    console.error("Error adding volunteer:", err);
    req.flash("error", "Could not volunteer for this project.");
    res.redirect(`/project/${projectId}`);
  }
};


// ------------------------------------------------------------
// Remove logged-in user as volunteer
// ------------------------------------------------------------
export const unvolunteerFromProject = async (req, res) => {
  const projectId = req.params.id;

  // FIX: support both id formats
  const userId = req.session.user?.user_id || req.session.user?.id;

  if (!userId) {
    req.flash("error", "You must be logged in.");
    return res.redirect(`/project/${projectId}`);
  }

  try {
    await removeVolunteer(projectId, userId);

    req.flash("success", "You are no longer volunteering for this project.");
    res.redirect(`/project/${projectId}`);
  } catch (err) {
    console.error("Error removing volunteer:", err);
    req.flash("error", "Could not remove volunteer status.");
    res.redirect(`/project/${projectId}`);
  }
};


// ------------------------------------------------------------
// Helper: Check volunteer status for project details page
// ------------------------------------------------------------
export const getVolunteerStatus = async (projectId, userId) => {
  if (!userId) return false;
  return await isUserVolunteering(projectId, userId);
};