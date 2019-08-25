/**
 * Modules
 */
const bodyParser = require("body-parser");
const jsonServer = require("json-server");
const boom = require("boom");
const morgan = require("morgan");
const dataDb = require("../server/db")();
const routesAuthMidellware = require("./routes/api/Auth/routesAuth");
const routesPaypalMidellware = require("./routes/api/paypal/paypal");
const {
  errorLog,
  clientErrorHandler,
  wrapError
} = require("./utilities/middelwares/errorHandler");

// create server
const app = jsonServer.create();
const PORT = 3000;

// Middelwars
app.use(jsonServer.defaults());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(morgan("dev"));

const router = jsonServer.router(dataDb);

// Route midellware
app.use("api", router);
routesAuthMidellware(app);
routesPaypalMidellware(app);

// Resource not found
app.use((req, res) => {
  const {
    output: { statusCode, payload }
  } = boom.notFound();

  return res.status(statusCode).json(payload);
});

// errorsHandlers
app.use(errorLog);
app.use(wrapError);
app.use(clientErrorHandler);

// init server
const startServer = () => console.log("Run Auth API Server");

app.listen(PORT, startServer);
