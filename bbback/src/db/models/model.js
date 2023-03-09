const mysql = require("mysql");
const UserSchema = require("../schemas/user");

exports.User = mysql.model("User", UserSchema);
