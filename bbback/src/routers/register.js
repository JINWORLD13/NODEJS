//회원가입을 처리하는 핸들러
const express = require("express");
const router = express.Router();
const getHash = require("../utils/hash-password");
const { User } = require("../db/models/model");

router.post("/", async (req, res, next) => {
  console.log("---------------- 사용자 회원 가입 시도 ---------------------");
  try {
    const createUser = req.body;

    // ------ 중복된 이메일 확인 ------
    const foundEmail = await User.findOne({ email: createUser.email });
    if (foundEmail) {
      console.error("중복된 이메일 존재");
      console.log(
        "---------------- 사용자 회원 가입 실패 ---------------------"
      );
      throw new Error("이미 존재하는 이메일입니다.");
    } else {
      // ------ 유효성 검사 (예정) ------

      const hashedPassword = getHash(createUser.password);
      const user = await User.create({
        ...createUser,
        password: hashedPassword,
      });

      console.log("신규 회원 : ", user);

      console.log(
        "---------------- 사용자 회원 가입 성공 ---------------------"
      );
      res.status(200).end();
    }
  } catch (e) {
    next(e);
  }
});

module.exports = router;
