const express = require("express");
const router = express.Router();
const { User } = require("../db/models/model");
const buildResponse = require("../utils/buildResponse");
const checkTokenWithRefresh = require("../utils/checkTokenWithRefresh");

// 사용자 정보 접근
router.get("/", checkTokenWithRefresh, async (req, res, next) => {
  try {
    console.log(
      "------------------- 사용자 정보 불러오기 시도 ------------------------"
    );
    const originalEmail = req.user.email;

    // 데이터 베이스에 매칭되는 사용자 정보가 있는지 확인
    const user = await User.findOne({ email: originalEmail });

    // user 가 없으면 매칭되는 이메일이 없다
    if (user === null || user === undefined) {
      // 일치하는 이메일이 없음 -> 에러
      console.error("user가 없음");
      console.log(
        "------------------- 사용자 정보 불러오기 실패 ------------------------"
      );
      throw new Error("사용자 정보 불러오기 실패");
    }

    const userInfo = {
      name: user.name,
      phoneNumber: user.phoneNumber,
      address: user.address,
      role: user.role,
    };
    console.log({userInfo});
    // 사용자 정보 보내기
    res.status(200).json(buildResponse({userInfo}, 200));
    console.log(
      "------------------- 사용자 정보 불러오기 성공 ------------------------"
    );
  } catch (err) {
    next(err);
  }
});

module.exports = router;
