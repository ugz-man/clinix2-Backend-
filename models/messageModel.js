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
  imageLink: {
    type: String,
    validate: {
      validator: function () {
        return this.messageType === 2;
      },
      message: "The message type must be 2 and the imageLink must be present.",
    },
  },
});

const Message = mongoose.model("Message", messageSchema);

module.exports = Message;
