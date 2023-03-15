const express = require("express");
const router = express.Router();
const buildResponse = require("../utils/buildResponse");
const { Districts } = require("../db/models/model");

router.get("/districts", async (req, res, next) => {
  try {
    let districtsData = await Districts.find();
    res.status(200).json(buildResponse(districtsData));
  } catch (err) {
    next(err);
  }
});

module.exports = router;
