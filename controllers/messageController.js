const Message = require("../models/messageModel");
const catchAsyncError = require("../utils/catchAsyncError");
const { sendTextMessage } = require("../utils/groq");

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

module.exports = { sendMessage };
