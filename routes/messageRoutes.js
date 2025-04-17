const express = require("express");

const messageController = require("../controllers/messageController");

const router = express.Router();

router.route("/").post(messageController.sendMessage);
router.route("/:userId").delete(messageController.deleteUserMessages);
router
  .route("/image-file")
  .post(
    messageController.uploadImageFile,
    messageController.resizeAndSendImageFile
  );

module.exports = router;
