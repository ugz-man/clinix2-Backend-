const mongoose = require("mongoose");
const dotenv = require("dotenv");

process.on("uncaughtException", (err) => {
  console.log(err.name, err.message);
  console.log("Unhandled Exception! Shutting Down...");
  process.exit(1);
});

dotenv.config({ path: "./config.env" });

const app = require("./app");

mongoose.set("strictQuery", false);
mongoose
  .connect(process.env.DATABASE)
  .then(() => console.log("DB connection successful"))
  .catch((err) => console.log("DB connection failed"));

const port = process.env.PORT || 5000;
const server = app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});

process.on("unhandledRejection", (err) => {
  console.log(err.name, err.message);
  // console.log(err);
  console.log("Unhandled Rejection! Shutting Down...");
  server.close(() => {
    process.exit(1);
  });
});
