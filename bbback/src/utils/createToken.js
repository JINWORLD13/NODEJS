const jwt = require("./jwt");
const AppError = require("./AppError");
const { User } = require("../db/models/model");

const createToken = async (req, res, next) => {
  try {
    let user = await User.findOne({
      email: req.body.inputEmail,
    });

    // 발생할 수 있는 오류들 thorw new Error() 이런식으로
    // catch에다 던지기
    // catch에서는 throw err하면 이 createToken을 부른 상위 함수의 catch의 err에 들어가고 최종적으론 next(err) 해야 오류 전역미들웨어(App.js에 있음))로 들어감

    // (주의) jsonwebtoken 라이브러리의 sign이 아닌, 커스텀한 jwt 모듈의 sign임.
    const token = jwt.sign(user);
    console.log("토큰이 발급되었습니다.");

    // (참고) token을 반환할지 res.status(200).json(buildResponse(token, 200)할지 고민)
    return token;
  } catch (err) {
    next(new AppError(err.name, err.message, 401));
  }
};

module.exports = createToken;
