"use strict";
const express = require("express");
const bodyParser = require("body-parser");
const app = express();
const port = process.env.PORT || 3000;
const db = require("./config/db");

// Using the body parser
// Need body parser with Express@4 for the request object
app.use(bodyParser.json());
app.use(
    bodyParser.urlencoded({
        extended: true,
    }),
);

// Connect Database
db.connectDB();

// set the view engine to ejs
app.set("view engine", "ejs");

// routes
app.use("/", require("./routes/profile")());
app.use("/user", require("./routes/user")());
app.use("/comment", require("./routes/comment")());

// start server
const server = app.listen(port);
console.log("Express started. Listening on %s", port);
