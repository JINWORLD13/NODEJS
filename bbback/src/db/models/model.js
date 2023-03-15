const mongoose = require("mongoose");
const UserSchema = require("../schemas/user");
const GraphSchema = require("../schemas/graph");
const ConstituencySchema = require("../schemas/constituency");

exports.Constituency = mongoose.model("Constituency", ConstituencySchema);
exports.User = mongoose.model("User", UserSchema);
exports.Graph = mongoose.model("Graph", GraphSchema);
