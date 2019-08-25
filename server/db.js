const users = require("./seeds/users.json");
const admins = require("./seeds/admins.json");
const payments = require("./seeds/payments.json");

module.exports = function() {
  return {
    users,
    admins,
    payments
  };
};
