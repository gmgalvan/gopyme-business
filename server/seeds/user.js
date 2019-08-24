const fs = require("fs");
const path = require("path");
const faker = require("faker");

function createUsers(limit = 5) {
  const data = [];

  for (let i = 0; i < limit; i++) {
    const firstName = faker.name.firstName();
    const lastName = faker.name.lastName();
    const email = faker.internet.email();
    const companyName = faker.company.companyName();
    const password = faker.internet.password();

    data.push({
      id: faker.random.uuid(),
      firstName,
      lastName,
      email,
      companyName,
      rfc: faker.random.alphaNumeric(12),
      password,
      role: "user"
    });
  }

  return data;
}

function users() {
  const data = {
    users: createUsers()
  };

  fs.writeFileSync(
    path.resolve(__dirname, "users.json"),
    JSON.stringify(data, null, 4)
  );
}

module.exports = users;
