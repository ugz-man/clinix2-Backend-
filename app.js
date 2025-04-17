const express = require("express");
const corsConfiguration = require("./cors/cors");
const path = require("path");
const helmet = require("helmet");
const { xss } = require("express-xss-sanitizer");
const expressMongoSanitize = require("@exortek/express-mongo-sanitize");

const router = require("./routes/routes");
const globalErrorHandler = require("./controllers/errorController");
const AppError = require("./utils/appError");

const app = express();

// Render is behind a proxy so req.protocol sends http instead of https
// this line enables this app to trust the proxy
if (process.env.NODE_ENV === "production") {
  app.set("trust proxy", true);
}

// Set http security headers
app.use(helmet());

// Serving static files
app.use(express.static(path.join(__dirname, "public")));

// Displaying development log while developing
if (process.env.NODE_ENV === "development") {
  const morgan = require("morgan");
  app.use(morgan("dev"));
}

// Handle json request in the body
app.use(express.json());

app.use(xss());

app.options("/{*splat}", corsConfiguration);
app.use(corsConfiguration);

// Routes
app.use("/api/v1", router);

expressMongoSanitize({ app, router });

app.all("/{*splat}", (req, res, next) => {
  next(new AppError(404, `Can't find ${req.originalUrl} on this server`));
});

app.use(globalErrorHandler);

module.exports = app;
