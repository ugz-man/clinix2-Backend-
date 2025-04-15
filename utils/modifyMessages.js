const modifyMessageTypeOne = function (messageObject) {
  return { role: messageObject.role, content: messageObject.text };
};

const modifyMessageTypeTwo = function (messageObject) {
  return {
    role: messageObject.role,
    content: [
      {
        type: "text",
        text: messageObject.text,
      },
      {
        type: "image_url",
        image_url: {
          url: messageObject.imageLink,
        },
      },
    ],
  };
};

module.exports = { modifyMessageTypeOne, modifyMessageTypeTwo };
