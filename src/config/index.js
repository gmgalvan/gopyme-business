/**
 * Modules
 */
require("dotenv").config();

const CONFIG = {
  secret: process.env.SECRET_KEY,
  host: process.env.HOST,
  paypalMode: process.env.PAYPAL,
  urlPaypal: process.env.SANDBOX
};

module.exports = CONFIG;
