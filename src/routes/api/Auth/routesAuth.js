/**
 * Modules
 */
const fs = require("fs");
const { resolve } = require("path");
const Boom = require("boom");
const { createToken, isAuthenticated } = require("../../../serivices/auth");
const validationHandler = require("../../../utilities/middelwares/validationHandler");

// Joi schemas
const loginSchema = require("../../../utilities/Schemas/login");

const authRouter = app => {
  app.post("/auth/login", validationHandler(loginSchema), login);
  app.post("/auth/login/admin", validationHandler(loginSchema), login);
};

const login = (req, res) => {
  const { path } = req.route;
  const { email, password, role } = req.body;

  // prettier-ignore
  let filepath = path === "/auth/login"
        ? resolve(__dirname, '../../../../server/seeds/users.json')
      : resolve(__dirname, '../../../../server/seeds/admins.json')

  const db = JSON.parse(fs.readFileSync(filepath, "UTF-8"));
  if (!isAuthenticated({ email, password }, db)) {
    const {
      output: { statusCode, payload }
    } = Boom.unauthorized("Invalid email or password");

    return res.status(statusCode).json(payload);
  }
  const access_token = createToken({ email, password, role });
  res.status(200).json({ access_token });
};

module.exports = authRouter;
