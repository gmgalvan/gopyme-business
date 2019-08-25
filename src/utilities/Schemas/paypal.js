/**
 * Modules
 */
const Joi = require("joi");

const paypalSchema = Joi.object().keys({
  clientid: Joi.string().required(),
  clientsecret: Joi.string().required(),
  email: Joi.string().required()
});

module.exports = paypalSchema;
