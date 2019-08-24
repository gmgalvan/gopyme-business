/**
 * Modules
 */
const joi = require("joi");
const boom = require("boom");

function validate(data, schema) {
  const { error } = joi.validate(data, schema);
  return error;
}

function validationHandler(schema, data = "body") {
  return function(req, res, next) {
    const error = validate(req[data], schema);
    error ? next(boom.badRequest(error)) : next();
  };
}

module.exports = validationHandler;
