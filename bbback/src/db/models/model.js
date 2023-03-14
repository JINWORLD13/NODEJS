const mongoose = require("mongoose");
const UserSchema = require("../schemas/user");
const GraphSchema = require("../schemas/graph");

exports.User = mongoose.model("User", UserSchema);
exports.Graph = mongoose.model("Graph", GraphSchema);
