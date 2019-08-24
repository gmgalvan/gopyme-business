/**
 * Modules
 */
const boom = require("boom");
function errorWithStack(err, stack) {
  if (process.env.NODE_ENV !== "production") return { ...err, stack };
  return err;
}

function errorLog(err, req, res, next) {
  console.error(err.stack);
  next(err);
}

function wrapError(err, req, res, next) {
  if (!err.isBoom) next(boom.badImplementation(err));

  next(err);
}

/* eslint-disable consistent-return */
function clientErrorHandler(err, req, res, next) {
  const {
    output: { statusCode, payload }
  } = err;

  res.status(statusCode).json(errorWithStack(payload, err.stack));
}

module.exports = {
  errorLog,
  clientErrorHandler,
  wrapError
};
