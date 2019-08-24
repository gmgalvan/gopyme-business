/**
 * Modules
 */
const jwt = require("jsonwebtoken");
const { secret } = require("../../config");
const expiresIn = "1h";

function createToken(payload) {
  return jwt.sign(payload, secret, { expiresIn });
}

// Verify the token
function verifyToken(token) {
  return jwt.verify(token, secret, (err, decode) =>
    decode !== undefined ? decode : err
  );
}

// Check if the user exists in database
function isAuthenticated({ email, password }, db) {
  return (
    db.users.findIndex(
      user => user.email === email && user.password === password
    ) !== -1
  );
}

module.exports = {
  createToken,
  verifyToken,
  isAuthenticated
};
