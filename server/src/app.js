// app.js
//
// Main entry point of the WB2020 server.

"use strict";



require("dotenv").config();
const http    = require("http");
const express = require("express");



const app = {};

app.exp = express();
app.srv = http.Server(app.exp);
// eslint-disable-next-line camelcase
app.exp.server_name = "";
app.exp.set("trust proxy", "loopback");
app.exp.set("x-powered-by", false);

const io = require("socket.io")(app.srv);

io.on("connection", socket => {
  console.log(`io.connection: ${socket.id}`);
  socket.emit("server_message", "WB2020 ready to be super fun");

  socket.on("disconnect", () => {
    console.log(`socket.disconnect: ${socket.id}`);
  });

  socket.on("add_card", (data) => {
    console.dir(`socket.add_card: ${JSON.stringify(data)}`);
    socket.broadcast.emit("add_card", data);
  });

});

app.srv.listen(process.env.APP_PORT);
