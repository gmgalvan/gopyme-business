/**
 * Modules
 */
const paypal = require("paypal-rest-sdk");
const Boom = require("boom");
const { paypalMode } = require("../../../config/index");
const handlerToken = require("../../../utilities/middelwares/validationTokenHanlder");
const validationHandler = require("../../../utilities/middelwares/validationHandler");
const paypalSchema = require("../../../utilities/Schemas/paypal");

const routesPaypalMidellware = app => {
  app.post("/paypal", handlerToken, handlerPaypal);
};

const handlerPaypal = (req, res, next) => {
  const { clientid, clientsecret } = req.headers;
  paypal.configure({
    mode: paypalMode,
    client_id: clientid,
    client_secret: clientsecret
  });

  const listPayment = {
    count: "1",
    start_index: "1"
  };

  paypal.payment.list(listPayment, (error, payment) => {
    try {
      if (error) throw new Error(error.response.error_description);
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

      res
        .status(200)
        .send({
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

module.exports = routesPaypalMidellware;
