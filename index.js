var express = require("express");
var cors = require("cors");
const mongoose = require("mongoose");

require("dotenv").config();

var app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

const uri = process.env.ATLAS_URI;
mongoose.connect(uri, { useNewUrlParser: true, useCreateIndex: true });
const connection = mongoose.connection;
connection.once("open", () => {
  console.log("MongoDB database connection enstablished succcessfully");
});

const visitorsRouter = require("./routes/visitors");
const usersRouter = require("./routes/users");

app.use("/visitors", visitorsRouter);
app.use("/users", usersRouter);

app.listen(port, function () {
  console.log(`CORS-enabled web server listening on port: ${port}`);
});
