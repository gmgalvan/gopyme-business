const users = require("./seeds/users.json");
const admins = require("./seeds/admins.json");

module.exports = function() {
  return {
    users,
    admins
  };
};
