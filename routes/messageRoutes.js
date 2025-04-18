const express = require("express");

const messageController = require("../controllers/messageController");

const router = express.Router();

// expressMongoSanitize({ router });

router.route("/").post(messageController.sendMessage);
router
  .route("/image-file")
  .post(
    messageController.uploadImageFile,
    messageController.resizeAndSendImageFile
  );
router.route("/:userId").post(messageController.deleteUserMessages);


module.exports = router;
