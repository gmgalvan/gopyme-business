/**
 * Modules
 */
const axios = require("axios");
const { host } = require("../config");

function callApi(port, endpoint, method = "get", data = {}, headers = {}) {
  return new Promise(async (resolve, reject) => {
    try {
      headers = {
        ...headers,
        "Content-Type": "application/json"
      };

      const url = `${host}:${port}${endpoint}`;
      const axiosConfig = {
        method,
        headers,
        url
      };

      if (method == "POST") axiosConfig.data = data;

      const response = await axios(axiosConfig);
      resolve(response.data);
    } catch (error) {
      reject(error);
    }
  });
}

module.exports = callApi;
