
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');

dotenv.config();
const JWT_SECRET = process.env.JWT_SECRET;

if (!JWT_SECRET) {
  console.error(
    "FATAL ERROR: JWT_SECRET is not defined in .env. Please add it."
  );
  process.exit(1);
}

const generateAuthToken = (user) => {
  const payload = {
    id: user._id,
    username: user.username,
    email: user.email,
    role: user?.role,
  };
  const token = jwt.sign(payload, JWT_SECRET, { expiresIn: "7d" });
  return token;
};

const authenticateToken = (req, res, next) => {
  const authHeader = req.headers["authorization"];

  const token = authHeader && authHeader.split(" ")[1];

  if (token == null) {
    return res
      .status(401)
      .json({ message: "Authentication required: No token provided." });
  }
  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) {
      console.error("JWT verification failed:", err.message);
      return res
        .status(403)
        .json({ message: "Authentication failed: Invalid or expired token." });
    }
    req.user = user;
    next();
  });
};

module.exports = {
  generateAuthToken,
  authenticateToken,
};
