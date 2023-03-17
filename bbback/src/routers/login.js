// 로그인을 처리하는 핸들러
const express = require("express");
const router = express.Router();
const getHash = require("../utils/hashPassword");
const { User } = require("../db/models/model");
// jwt 생성 모듈
const createToken = require("../utils/createToken");
const buildResponse = require("../utils/buildResponse");

// 로그인 패스 접근시 (로그인 버튼 클릭시)
router.post("/", async (req, res, next) => {
  try {
    // req에 담겨있는 정보 (아이디와 패스워드)를 받아서
    console.log(
      "------------------- 사용자 로그인 시도 ------------------------"
    );
    const { inputEmail, inputPw } = req.body;

    // 데이터 베이스에 매칭되는 사용자 정보가 있는지 확인
    const user = await User.findOne({ email : inputEmail });

    // user 가 없으면 매칭되는 이메일이 없다
    if (user === null || user === undefined) {
      // 일치하는 이메일이 없음 -> 에러
      console.error("user가 없음");
      console.log(
        "------------------- 사용자 로그인 실패 ------------------------"
      );
      throw new Error("일치하는 사용자 이메일이 없음");
    }

    // 비밀번호가 일치 하지 않음 -> 에러
    if (user.password !== getHash(inputPw)) {
      console.error("비밀번호 불일치");
      console.log(
        "------------------- 사용자 로그인 실패 ------------------------"
      );
      throw new Error("비밀번호가 일치하지 않음");
    }

    // 로그인 성공 jwt token 생성
    console.log(
      "------------------- 사용자 토큰 발급 시도 ------------------------"
    );

    // (참고) createToken.js의 주석 중 (참고) 참조.
    const token = await createToken(req, res, next);

    // 응답으로 토큰
    res.status(200).json(buildResponse(token, 200));
    console.log(
      "------------------- 사용자 토큰 발급 완료 ------------------------"
    );
  } catch (err) {
    next(err);
  }
});

module.exports = router;
