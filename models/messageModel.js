const mongoose = require("mongoose");

const messageSchema = new mongoose.Schema({
  userId: {
    type: String,
    required: [true, "The userId cannot be empty"],
  },
  messageType: {
    type: Number,
    min: 1,
    required: [true, "The Message type cannot be empty"],
  },
  role: {
    type: String,
    required: [true, "The role cannot be empty"],
    enum: ["user", "assistant"],
    default: "assistant",
  },
  text: {
    type: String,
    required: [true, "The role cannot be empty"],
  },
  date: {
    type: Date,
    default: Date.now(),
  },
  imageLink: String,
});

const Message = mongoose.model("Message", messageSchema);

module.exports = Message;
