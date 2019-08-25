const users = require("./seeds/users.json");
const admins = require("./seeds/admins.json");
const loan = require("./seeds/loan.json");

module.exports = function() {
  return {
    users,
    admins,
    loan
  };
};
