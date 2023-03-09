const jwt = require("jsonwebtoken");

// user_id를 암호화 (payload == user._id)

module.exports = (payload) => {
  const token = jwt.sign(payload, "10team");
  console.log("token : ", token);
  return token;
};
