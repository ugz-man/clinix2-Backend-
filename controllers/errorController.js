const AppError = require("../utils/appError");

const sendErrorDev = function (error, req, res) {
  res.status(error.statusCode).json({
    status: error.status,
    error,
    message: error.message,
    stack: error.stack,
  });
};

const sendErrorProduction = function (error, req, res) {
  if (error.isOperational) {
    res
      .status(error.statusCode)
      .json({ status: error.status, message: error.message });
  } else {
    res.status(500).json({ status: "Error", message: "Something went wrong" });
  }
};

module.exports = async function (err, req, res, next) {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || "error";

  if (process.env.NODE_ENV === "development") {
    sendErrorDev(err, req, res);
  } else if (process.env.NODE_ENV === "production") {
    let error = { ...err };
    error.message = err.message;

    sendErrorProduction(error, req, res);
  }
};
