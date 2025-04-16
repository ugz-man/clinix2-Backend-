const cors = require("cors");

if (production.env.NODE_ENV === "development") {
  module.exports = cors();
} else if (production.env.NODE_ENV === "production") {
  module.exports = cors({
    origin: "https://clinix2-frontend.vercel.app/",
    optionsSuccessStatus: 204,
  });
}
