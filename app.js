const express = require("express");
const morgan = require("morgan");
const cors = require("cors");

const messageRouter = require("./routes/messageRoutes");
const globalErrorHandler = require("./controllers/errorController");
const AppError = require("./utils/appError");

const app = express();

if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}

app.use(express.json());

app.options("/{*splat}", cors());
app.use(cors());

// Routes
app.use("/api/v1/messages", messageRouter);

app.all("/{*splat}", (req, res, next) => {
  next(new AppError(404, `Can't find ${req.originalUrl} on this server`));
});

app.use(globalErrorHandler);

module.exports = app;
