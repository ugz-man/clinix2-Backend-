const express = require("express");

const messageRouter = require("./messageRoutes");

const router = express.Router();

router.use("/messages", messageRouter);

module.exports = router;
