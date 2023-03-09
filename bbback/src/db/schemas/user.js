const { Schema } = require("mysql");

const UserSchema = new Schema(
  {
    // userId: nanoId,
    userName: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
    phone: {
      type: String,
      required: false,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = UserSchema;
