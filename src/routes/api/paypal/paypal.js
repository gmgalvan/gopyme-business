/**
 * Modules
 */
const Boom = require("boom");
const callApi = require("../../../utilities/callApi");
const axios = require("axios");
const { paypalMode, urlPaypal } = require("../../../config/index");
const { verifyToken } = require("../../../serivices/auth/index");
const handlerToken = require("../../../utilities/middelwares/validationTokenHanlder");
const validationHandler = require("../../../utilities/middelwares/validationHandler");
const paypalSchema = require("../../../utilities/Schemas/paypal");

const routesPaypalMidellware = app => {
  app.post(
    "/paypal",
    // handlerToken,
    validationHandler(paypalSchema),
    handlerPaypal
  );
  app.get("/corrida/financiera", fianche);
};

const handlerPaypal = async (req, res, next) => {
  const { clientid, clientsecret, email } = req.body;
  // let token = bearer.split(" ")[1];
  // token = verifyToken(token);

  // const verify = token.hasOwnProperty("email");
  // // if doesnt exist jwt
  // if (!verify) {
  //   const {
  //     output: { statusCode, payload }
  //   } = Boom.unauthorized("unauthorized");
  //   res.status(statusCode).send(payload);
  // }

  try {
    // get id user by email
    let userid = await callApi("3001", `/users?email=${email}`);
    userid = userid[0].id;

    // paypal Api

    // let {
    //   data: { transaction_details }
    // } = await axios({
    //   method: "get",
    //   url: urlPaypal,
    //   auth: {
    //     username: clientid,
    //     password: clientsecret
    //   }
    // });
    // console.log(transaction_details);

    // Process credit capacity
    const creditMountly = 48000;
    const bankRate = 0.4;
    const capital = 0.6;
    const payments12 = creditMountly / 10;
    //   pay for 12 mounts
    const interestPerMounth = payments12 * bankRate;
    const capitalPerMount = payments12 * capital;
    const interestTotal = interestPerMounth * 12;
    const capitalAprobe = capitalPerMount * 12;
    const total = interestPerMounth + capitalPerMount;
    savePayments({
      userid,
      payments: payments12,
      interestPerMounth,
      capitalPerMount,
      capitalAprobe,
      total,
      interestTotal
    });

    res.status(200).send({
      payments: payments12,
      bankRate,
      capital,
      interestPerMounth,
      capitalPerMount,
      total,
      capitalAprobe
    });
  } catch (err) {}
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

const fianche = (req, res) => {
  const creditMountly = 48000;
  const bankRate = 0.4;
  const capital = 0.6;
  const payments12 = creditMountly / 10;
  //   pay for 12 mounts
  const interestPerMounth = payments12 * bankRate;
  const capitalPerMount = payments12 * capital;

  const corrida = [];
  const date = new Date();
  const day = 1;
  let year = date.getFullYear();
  let month = date.getMonth();

  for (let i = 0; i < 12; i++) {
    month++;
    if (month > 12) year++;
    month = month > 12 ? 1 : month;
    console.log(year, month);
    corrida.push({
      date: `${year}-${month}-${day}`,
      interestPerMounth,
      capitalPerMount
    });
  }

  res.status(200).json({ corrida });
};

module.exports = routesPaypalMidellware;
