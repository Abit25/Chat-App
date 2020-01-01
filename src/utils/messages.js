const generateMessage = text => {
  return {
    message: text,
    createdAt: new Date().getTime()
  };
};

module.exports = { generateMessage };
