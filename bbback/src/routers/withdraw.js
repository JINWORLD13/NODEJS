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
    const inputPw = req.body.inputPw; // 프론트에서 axios.delete('url주소', {data: {inputPw}})와 같은 형식으로 넘어온 데이터

    // 데이터 베이스에 매칭되는 사용자 정보가 있는지 확인
    const user = await User.findOne({ password : getHash(inputPw)})

    // user 가 없으면 매칭되는 이메일이 없다
    if (user === null || user === undefined) {
      // 일치하는 이메일이 없음 -> 에러
      console.error("user가 없음");
      console.log(
        "------------------- 사용자 회원탈퇴 실패 ------------------------"
      );
      throw new Error("비밀번호가 틀렸음");
    }

    await User.deleteOne({ password: getHash(inputPw) })
    // 회원탈퇴 성공
    res.status(204).json(); // 204쓰면 json 전달 안됨.
    console.log(
      "------------------- 사용자 회원탈퇴 성공 ------------------------"
    );
  } catch (err) {
    next(err);
  }
});

module.exports = router;
