/**
 * Modules
 */
require("dotenv").config();

const CONFIG = {
  secret: process.env.SECRET_KEY
};

module.exports = CONFIG;
