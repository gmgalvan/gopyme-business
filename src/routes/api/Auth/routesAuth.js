/**
 * Modules
 */
const Boom = require("boom");
const { createToken, isAuthenticated } = require("../../../serivices/auth");
const validationHandler = require("../../../utilities/middelwares/validationHandler");
const callApi = require("../../../utilities/callApi");

// Joi schemas
const loginSchema = require("../../../utilities/Schemas/login");

const authRouter = app => {
  app.post("/auth/login", validationHandler(loginSchema), login);
  app.post("/auth/login/admin", validationHandler(loginSchema), login);
  app.post("/user", createUser);
};

const createUser = async (req, res) => {
  try {
    let data = req.body;
    data.role = "user";

    await callApi("3001", "/users", "POST", data);
    const access_token = createToken({
      email: data.email,
      password: data.password,
      role: data.role
    });
    res.status(200).json({ access_token, user: data });
  } catch (error) {
    const {
      output: { statusCode, payload }
    } = Boom.badImplementation();

    return res.status(statusCode).json(payload);
  }
};

const login = async (req, res) => {
  const { path } = req.route;
  const { email, password, role } = req.body;

  const port = path === "/auth/login" ? "3001" : "3002";
  const userData = await isAuthenticated({ email, password }, port);

  if (!userData) {
    const {
      output: { statusCode, payload }
    } = Boom.unauthorized("Invalid email or password");

    return res.status(statusCode).json(payload);
  }

  const access_token = createToken({ email, password, role });
  res.status(200).json({ access_token, user: userData });
};

module.exports = authRouter;
