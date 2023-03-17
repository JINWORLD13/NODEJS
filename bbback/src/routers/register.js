//회원가입을 처리하는 핸들러
const express = require("express");
const router = express.Router();
const getHash = require("../utils/hashPassword");
const { User } = require("../db/models/model");
const Regex = require("../utils/regex");

router.post("/", async (req, res, next) => {
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

      // ------ 중복된 이메일 확인 ------
      const email = createUser.inputEmail;
      const foundUser = await User.findOne({ email });

      if (foundUser === null || foundUser === undefined) {
        const name = createUser.inputName;
        const email = createUser.inputEmail;
        const hashedPassword = getHash(createUser.inputPw);
        const phoneNumber = createUser.inputPhoneNumber;
        const address = createUser.selectedDistrict;
        await User.create({
          name: name,
          email: email,
          password: hashedPassword,
          phoneNumber: phoneNumber,
          address: address,
        });

        console.log(
          "---------------- 사용자 회원 가입 성공 ---------------------"
        );
        res.status(200).json();
      } else {
        console.error("중복된 이메일 존재");
        console.log(
          "---------------- 사용자 회원 가입 실패 ---------------------"
        );
        throw new Error("이미 존재하는 이메일입니다.");
      }
    } catch (e) {
      next(e);
    }
  }
});

module.exports = router;
