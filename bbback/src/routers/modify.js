const express = require("express");
const router = express.Router();
const getHash = require("../utils/hashPassword");
const { User } = require("../db/models/model");
const Regex = require("../utils/regex");
const checkTokenWithRefresh = require("../utils/checkTokenWithRefresh");

router.put("/", checkTokenWithRefresh, async (req, res, next) => {
  console.log("---------------- 사용자 회원 가입 시도 ---------------------");
  // -------------유효성 검사--------------------------
  if (Regex(req.body.inputName, "name") !== true) {
    console.log("이름 형식이 맞지 않습니다.");
  } else if (Regex(req.body.inputEmail, "email") !== true) {
    console.log("이메일 형식이 맞지 않습니다.");
  } else if (Regex(req.body.inputPw, "password") !== true) {
    console.log("비밀번호 형식이 맞지 않습니다.");
  } else if (Regex(req.body.inputPhoneNumber, "phone") !== true) {
    console.log("번호 형식이 맞지 않습니다.");
  } else {
    try {
      const createUser = req.body;

      const name = createUser.inputName;
      const email = createUser.inputEmail;
      const hashedPassword = getHash(createUser.inputPw);
      const phoneNumber = createUser.inputPhoneNumber;
      const address = createUser.selectedDistrict;

      const originalEmail = req.user.email;

      // ------ 업데이트 완료한 user 객체 ------
      const user = await User.updateOne(
        { originalEmail },
        { name, email, password: hashedPassword, phoneNumber, address }
      );

      // user가 없으면 업데이트 실패
      if (user === null || user === undefined) {
        console.log(
          "------------------- 사용자 정보 업데이트 실패 ------------------------"
        );
        throw new Error("사용자 정보 업데이트 실패");
      }

      console.log(
        "---------------- 사용자 정보 업데이트 성공 ---------------------"
      );
      res.status(200).end();
    } catch (e) {
      next(e);
    }
  }
});

module.exports = router;
