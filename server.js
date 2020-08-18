const express = require("express");
const bodyParser = require("body-parser");
const server = express();
const jwt = require("jsonwebtoken");

server.listen(3000, () => {
    console.log("server ok");
  });