const express = require("express");
const router = express.Router();
const getHash = require("../utils/hashPassword");
const { User } = require("../db/models/model");
const buildResponse = require("../utils/buildResponse");
const checkTokenWithRefresh = require("../utils/checkTokenWithRefresh");

// 회원탈퇴
router.delete("/", checkTokenWithRefresh, async (req, res, next) => {
  try {
    console.log(
      "------------------- 사용자 회원탈퇴 시도 ------------------------"
    );
    const inputPw = req.body.inputPw;
    console.log(inputPw)

    // 데이터 베이스에 매칭되는 사용자 정보가 있는지 확인
    const user = await User.deleteOne({ inputPw : getHash(inputPw) })

    // user 가 없으면 매칭되는 이메일이 없다
    if (user === null || user === undefined) {
      // 일치하는 이메일이 없음 -> 에러
      console.error("user가 없음");
      console.log(
        "------------------- 사용자 회원탈퇴 실패 ------------------------"
      );
      throw new Error("비밀번호가 틀렸음");
    }

    // 회원탈퇴 성공
    res.status(204).json(buildResponse(null, 204));
    console.log(
      "------------------- 사용자 회원탈퇴 성공 ------------------------"
    );
  } catch (err) {
    next(err);
  }
});

module.exports = router;
