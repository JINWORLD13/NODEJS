//회원가입을 처리하는 핸들러
const express = require("express");
const router = express.Router();
const getHash = require("../utils/hashPassword");
const { User } = require("../db/models/model");

router.post("/", async (req, res, next) => {
  console.log("---------------- 사용자 회원 가입 시도 ---------------------");
  try {
    const createUser = req.body;

    // ------ 중복된 이메일 확인 ------
    const email = createUser.inputEmail;
    const foundUser = await User.findOne({ email });
    console.log(createUser.inputEmail);
    console.log(User);
    console.log(foundUser);
    if (foundUser === null || foundUser === undefined) {
      // ------ 유효성 검사 (예정) ------

      const name = createUser.inputName;
      const email = createUser.inputEmail;
      const hashedPassword = getHash(createUser.inputPw);
      const phoneNumber = createUser.inputPhoneNumber;
      const address = createUser.selectedDistrict;
      const user = await User.create({
        name: name,
        email: email,
        password: hashedPassword,
        phoneNumber: phoneNumber,
        address: address,
      });

      console.log("신규 회원 : ", user);

      console.log(
        "---------------- 사용자 회원 가입 성공 ---------------------"
      );
      res.status(200).end();
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
});

module.exports = router;
