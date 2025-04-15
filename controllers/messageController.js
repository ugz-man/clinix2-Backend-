const multer = require("multer");
const sharp = require("sharp");

const Message = require("../models/messageModel");
const catchAsyncError = require("../utils/catchAsyncError");
const { sendTextMessage } = require("../utils/groq");
const AppError = require("../utils/appError");

const multerStorage = multer.memoryStorage();

const multerFilter = function (req, file, cb) {
  if (file.mimetype.startsWith("image")) {
    cb(null, true);
  } else {
    cb(new AppError(400, "Not an image! Please upload only images"), false);
  }
};

const upload = multer({
  storage: multerStorage,
  fileFilter: multerFilter,
});

const sendMessage = catchAsyncError(async function (req, res, next) {
  // create a new message that was sent by the user in the database
  const message = await Message.create(req.body);
  // find all the messages that had been found by that particular user
  let messages = await Message.find({ userId: message.userId })
    .select("role text")
    .sort("date");
  // convert the messages to strings and then to array
  // this is due to the behaviour of mongoose,
  // so as to have acces to all fields present
  messages = JSON.parse(JSON.stringify(messages));

  // modify the array to contain only objects with role and content field
  const modifiedMessages = messages.map((message) => ({
    role: message.role,
    content: message.text,
  }));

  // send all the messages to the AI
  const response = await sendTextMessage(modifiedMessages);
  // save the respose of the AI to the database
  const savedResponse = await Message.create({
    userId: message.userId,
    messageType: 1,
    text: response,
  });
  // send the result to the client
  res.status(200).json({ status: "success", data: { data: savedResponse } });
});

const uploadImageFile = upload.single("imageFile");

const resizeAndSendImageFile = catchAsyncError(async function (req, res, next) {
  if (!req.file) {
    next(new AppError(400, "No FIle found"));
    return;
  }

  req.file.filename = `message-${Math.random()
    .toString(36)
    .substring(2)}-${Date.now()}.jpeg`;

  await sharp(req.file.buffer)
    .resize(700, 700)
    .toFormat("jpeg")
    .jpeg({ quality: 70 })
    .toFile(`public/images/messages/${req.file.filename}`);

  const fileName = req.file.filename;
  const imageLink = `${req.protocol}://${req.get("host")}/images/messages/${
    req.file.filename
  }`;
  res.status(200).json({
    status: "success",
    data: { imageLink, fileName },
  });
});

module.exports = { sendMessage, uploadImageFile, resizeAndSendImageFile };
