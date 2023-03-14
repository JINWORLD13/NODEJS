const jwt = require("jsonwebtoken");

// user_id를 암호화 (payload == user._id)

module.exports = (payload) => {
  const token = jwt.sign(payload, "3team");
  console.log("token : ", token);
  return token;
};
