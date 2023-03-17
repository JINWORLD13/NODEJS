const express = require("express");
const router = express.Router();
const getHash = require("../utils/hashPassword");
const { User } = require("../db/models/model");
const Regex = require("../utils/regex");
const checkTokenWithRefresh = require("../utils/checkTokenWithRefresh");
const buildResponse = require("../utils/buildResponse");
const createToken = require("../utils/createToken");

router.put("/", checkTokenWithRefresh, async (req, res, next) => {
  console.log("---------------- 사용자 정보 변경 시도 ---------------------");
  const userFound = await User.findOne({ email: req.user.email});
  // -------------유효성 검사--------------------------
  if (Regex(req.body.inputName, "name") !== true) {
    console.log("이름 형식이 맞지 않습니다.");
    req.body.inputName = userFound.name;
  }
  if (Regex(req.body.inputEmail, "email") !== true) {
    console.log("이메일 형식이 맞지 않습니다.");
    req.body.inputEmail = userFound.email;
  }
  if (Regex(req.body.inputPw, "password") !== true) {
    console.log("비밀번호 형식이 맞지 않습니다.");
    req.body.inputPw = userFound.password;
  }
  if (Regex(req.body.inputPhoneNumber, "phone") !== true) {
    console.log("번호 형식이 맞지 않습니다.");
    req.body.inputPhoneNumber = userFound.phoneNumber;
  }
  if (req.body.selectedDistrict === ''){
    req.body.selectedDistrict = userFound.address;
  }

  try {
    const createUser = req.body;

    const name = createUser.inputName;
    const email = createUser.inputEmail;
    const hashedPassword = createUser.inputPw !== undefined || createUser.inputPw !== null ? createUser.inputPw : getHash(createUser.inputPw);
    const phoneNumber = createUser.inputPhoneNumber;
    const address = createUser.selectedDistrict;

    const originalEmail = req.user.email;

    // ------ 업데이트 완료한 user 객체 ------
    const user = await User.updateOne(
      { email: originalEmail },
      { name, email, password: hashedPassword, phoneNumber, address }
    );

    // user가 없으면 업데이트 실패
    if (user === null || user === undefined) {
      console.log(
        "------------------- 사용자 정보 변경 실패 ------------------------"
      );
      throw new Error("사용자 정보 업데이트 실패");
    }
    const newTokens = await createToken(req, res, next);

    console.log("---------------- 사용자 정보 변경 성공 ---------------------");
    res.status(200).json(buildResponse({newAccessToken : newTokens.accessToken}, 200));
  } catch (e) {
    next(e);
  }
});

module.exports = router;
