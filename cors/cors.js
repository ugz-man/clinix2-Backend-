const cors = require("cors");

if (process.env.NODE_ENV === "development") {
  module.exports = cors();
} else if (process.env.NODE_ENV === "production") {
  module.exports = cors({
    origin: "https://clinix2-frontend.vercel.app/",
    optionsSuccessStatus: 204,
  });
}
