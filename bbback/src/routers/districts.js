const express = require("express");
const router = express.Router();
const buildResponse = require("../utils/buildResponse")


router.get("/districts", async (req, res, next) => {
  try {
    let districtsData = "db에서 지역명 뽑는 방식"
    res.status(200).json(buildResponse(districtsData));
  } catch (err) {
    next(err);
  }
});

module.exports = router;
