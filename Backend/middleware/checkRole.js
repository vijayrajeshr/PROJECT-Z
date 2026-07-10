/**
 * Middleware to check if a user has one of the required roles.
 * This MUST be used AFTER your existing authMiddleware.
 * Your User.role is an array, so we check if any required roles are in that array.
 *
 * @param {string[]} requiredRoles - An array of role strings (e.g., ['admin', 'eventCreator'])
 */
const checkRole = (requiredRoles) => (req, res, next) => {
  // Support both legacy session-based auth and JWT auth (req.user)
  const user = req.user || req.session?.user || req.session?.dashboardUser;

  if (!user || !user.role) {
    return res.status(403).json({ error: "Forbidden: No user role found." });
  }

  // Your User model stores roles as an array.
  // We check if the user's role array includes AT LEAST ONE of the required roles.
  const roles = Array.isArray(user.role) ? user.role : [user.role];
  const hasRole = roles.some((role) => requiredRoles.includes(role));

  if (!hasRole) {
    return res
      .status(403)
      .json({ error: "Forbidden: You do not have the necessary permissions." });
  }

  // User has the required role
  next();
};

module.exports = checkRole;