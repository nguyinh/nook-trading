const express = require("express");
const path = require("path");
const mongoose = require("mongoose");
const cookieParser = require("cookie-parser");
const bodyParser = require("body-parser");
const cors = require("cors");

const routes = require("./routes");
const app = express();
const { logger, redirectSecure, errorHandler } = require("./middlewares");

require("dotenv").config();

// CORS handle
const whitelist = [
  "http://172.20.10.3:3000",
  "http://172.20.10.4:3000",
  "http://172.20.10.5:3000",
  "http://localhost:3000",
  "http://localhost:2020",
];
const corsOptions = {
  origin: function (origin, callback) {
    if (whitelist.indexOf(origin) !== -1 || !origin) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
  credentials: true,
  exposedHeaders: ["x-auth-token", "Set-Cookie"],
};
app.use(cors(corsOptions));

// if (process.env.ENV !== 'dev') {
//   app.use(redirectSecure);
// }

// app.use((req, res, next) => {
//   res.header('Access-Control-Allow-Origin', 'http://localhost:3000');
//   res.header('Access-Control-Allow-Credentials', 'true');

//   // authorized headers for preflight requests
//   // https://developer.mozilla.org/en-US/docs/Glossary/preflight_request
//   res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
//   next();

//   app.options('*', (req, res) => {
//       // allowed XHR methods
//       res.header('Access-Control-Allow-Methods', 'GET, PATCH, PUT, POST, DELETE, OPTIONS');
//       res.send();
//   });
// });

app.use(bodyParser.json({ limit: "50mb" }));
app.use(bodyParser.urlencoded({ limit: "50mb", extended: true }));
app.use(cookieParser());

const mongoURL =
  process.env.MONGODB_URI || "mongodb://localhost/animal-trading";
mongoose.connect(mongoURL, {
  useNewUrlParser: true,
  bufferCommands: false,
  useUnifiedTopology: true,
  useCreateIndex: true,
  useFindAndModify: false,
});

const db = mongoose.connection;
db.on("error", () => {
  logger.error("[MongoDB] Error during connection");
});
db.once("open", () => {
  logger.info(`[MongoDB] Connected to ${mongoURL}`);
});

// Serve static files from the React app
app.use(express.static(path.join(__dirname, "front/build")));

// Enable API REST
routes(app);

// Put all API endpoints under '/api'
app.get("/api/*", (req, res) => {
  res.json(`Welcome to Animal trading API, your request is wrong 🐙`);
});

app.use(errorHandler);

// The "catchall" handler: for any request that doesn't
// match one above, send back React's index.html file.
// app.get('*', (req, res) => {
//   res.sendFile(path.join(__dirname + '/client/build/index.html'));
// });

const port = process.env.PORT || 2020;

if (process.env.ENV === "dev") app.listen(port, "0.0.0.0");
// app.listen(port, '0.0.0.0');
else app.listen(port);

logger.info(`[Express] Server listening on http://localhost:${port}`);
