const formatTime = require("date-format");
const createMessage = (messagesText,username) => {
  return {
    messagesText,
    createAt: formatTime("dd//MM/yyyy - hh:mm:ss", new Date()),
    username,
  };
};

module.exports = {
  createMessage,
};
