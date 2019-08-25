/**
 * Modules
 */
const jwt = require("jsonwebtoken");
const { secret } = require("../../config");
const expiresIn = "1h";
const callApi = require("../../utilities/callApi");

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
async function isAuthenticated({ email, password }, port) {
  try {
    let user = await callApi(port, `/users?email=${email}`);
    user = user[0];

    if (!user || user.password !== password) throw new Error();
    return user;
  } catch (error) {
    return false;
  }
}

module.exports = {
  createToken,
  verifyToken,
  isAuthenticated
};
