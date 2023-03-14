const { nanoid } = require("nanoid");

const nanoId = {
  type: String,
  default: () => {
    return nanoid();
  },
  required: true,
  index: true,
};

module.exports = nanoId;
