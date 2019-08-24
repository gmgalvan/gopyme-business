const fs = require("fs");
const path = require("path");
const faker = require("faker");

function createAdmins(limit = 2) {
  const data = [];

  for (let i = 0; i < limit; i++) {
    const firstName = faker.name.firstName();
    const lastName = faker.name.lastName();
    const email = faker.internet.email();
    const password = faker.internet.password();

    data.push({
      id: faker.random.uuid(),
      firstName,
      lastName,
      email,
      password,
      role: "admin"
    });
  }

  return data;
}

function admins() {
  const data = {
    users: createAdmins()
  };

  fs.writeFileSync(
    path.resolve(__dirname, "admins.json"),
    JSON.stringify(data, null, 4)
  );
}

module.exports = admins;
