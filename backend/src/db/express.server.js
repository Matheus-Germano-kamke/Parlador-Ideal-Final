const express = require("express");
const app = express();
const expressConfig = require("../configs/express.config");

app.use(express.json({ limit: "10mb" }));
const register = require("../api");
register(app);

module.exports = async function expresslistener() {
  app.listen(expressConfig.port, () => {
    console.log(`Serve at https://192.168.18.15:${expressConfig.port}`);
  });
};
