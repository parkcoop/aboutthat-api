require("dotenv").config();

const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const express = require("express");
const favicon = require("serve-favicon");
const hbs = require("hbs");
const mongoose = require("mongoose");
const logger = require("morgan");
const path = require("path");
const session = require("express-session");
const passport = require("passport");
const cors = require("cors");

require("./configs/passport");
mongoose
  .connect(process.env.MONGO, { useNewUrlParser: true })
  .then(x => {
    console.log(
      `Connected to Mongo! Database name: "${x.connections[0].name}"`
    );
  })
  .catch(err => {
    console.error("Error connecting to mongo", err);
  });

const app_name = require("./package.json").name;
const debug = require("debug")(
  `${app_name}:${path.basename(__filename).split(".")[0]}`
);

const app = express();

// Middleware Setup
app.use(logger("dev"));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.all("/*", function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "X-Requested-With");
  next();
});
// Express View engine setup
app.use(
  session({
    secret: "some secret goes here",
    resave: true,
    saveUninitialized: true
  })
);
app.use(
  require("node-sass-middleware")({
    src: path.join(__dirname, "public"),
    dest: path.join(__dirname, "public"),
    sourceMap: true
  })
);
app.use(passport.initialize());
app.use(passport.session());

app.set("views", path.join(__dirname, "views"));
app.set("view engine", "hbs");
app.use(express.static(path.join(__dirname, "public")));
app.use(favicon(path.join(__dirname, "public", "images", "favicon.ico")));
// app.all("/*", function(req, res, next) {
//   res.header("Access-Control-Allow-Origin", "*");
//   res.header("Access-Control-Allow-Headers", "X-Requested-With");
//   next();
// });

// app.use(function(req, res, next) {
//   res.header("Access-Control-Allow-Origin", "*");
//   res.header("Access-Control-Allow-Headers", "Content-Type,Authorization");
//   res.header("Access-Control-Allow-Methods", "GET,POST,PUT,PATCH,DELETE");
//   if (req.method === "OPTIONS") {
//     return res.send(204);
//   }
//   next();
// });
app.use(
  cors({
    origin: function(origin, callback) {
      return callback(null, true);
    },
    optionsSuccessStatus: 200,
    credentials: true
  })
);
// default value for title local
app.locals.title = "Express - Generated with IronGenerator";

const authRoutes = require("./routes/auth-routes");
app.use("/api", authRoutes);

const index = require("./routes/index");
app.use("/", index);

module.exports = app;
