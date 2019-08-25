/**
 * Modules
 */
const paypal = require("paypal-rest-sdk");
const Boom = require("boom");
const callApi = require("../../../utilities/callApi");
const { paypalMode } = require("../../../config/index");
const { verifyToken } = require("../../../serivices/auth/index");
const handlerToken = require("../../../utilities/middelwares/validationTokenHanlder");
const validationHandler = require("../../../utilities/middelwares/validationHandler");
const paypalSchema = require("../../../utilities/Schemas/paypal");

const routesPaypalMidellware = app => {
  app.post("/paypal", handlerToken, handlerPaypal);
};

const handlerPaypal = (req, res, next) => {
  const { clientid, clientsecret, authorization } = req.headers;
  let token = authorization.split(" ")[1];
  token = verifyToken(token);

  const verify = token.hasOwnProperty("email");
  // if doesnt exist jwt
  if (!verify) {
    const {
      output: { statusCode, payload }
    } = Boom.unauthorized("unauthorized");
    res.status(statusCode).send(payload);
  }

  paypal.configure({
    mode: paypalMode,
    client_id: clientid,
    client_secret: clientsecret
  });

  const listPayment = {
    count: "1",
    start_index: "1"
  };

  paypal.payment.list(listPayment, async (error, payment) => {
    try {
      if (error) throw new Error(error.response.error_description);

      // get id user by email
      let userid = await callApi("3001", `/users?email=${token.email}`);
      userid = userid[0].id;
      // Process credit capacity
      let creditMountly = 48000;
      const bankRate = 0.4;
      const capital = 0.6;
      const payments12 = creditMountly / 10;
      //   pay for 12 mounts
      const interestPerMounth = creditMountly * bankRate;
      const capitalPerMount = capital * creditMountly;
      const interestTotal = interestPerMounth * 12;
      const capitalAprobe = capitalPerMount * 12;

      savePayments({
        userid,
        payments: payments12,
        interestPerMounth,
        capitalPerMount,
        capitalAprobe,
        interestTotal
      });

      res.status(200).send({
        payments: payments12,
        bankRate,
        capital,
        interestPerMounth,
        capitalAprobe
      });
    } catch (error) {
      const {
        output: { statusCode, payload }
      } = Boom.unauthorized(error.message);
      res.status(statusCode).send(payload);
    }
  });
};

const userData = async email => {
  try {
    console.log(user, "dentro");
    let user = await callApi(port, `/users?email=${email}`);
    return user.id;
  } catch (error) {
    return false;
  }
};

const savePayments = async payment => {
  try {
    let data = await callApi("3003", "/payments", "POST", payment);
    return data;
  } catch (error) {
    return error;
  }
};

module.exports = routesPaypalMidellware;
