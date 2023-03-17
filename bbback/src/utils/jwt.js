const jwt = require("jsonwebtoken");
const AppError = require("./AppError");
const secretKey = require("../config/secretKey").secretKey;
const accessTokenOption = require("../config/secretKey").accessTokenOption;
const refreshTokenOption = require("../config/secretKey").refreshTokenOption;
const TOKEN_EXPIRED = 2;
const TOKEN_INVALID = 1;

module.exports = {
  // 이 sign은 jsonwebtoken 모듈의 sign이 아니다. 다시 정의하고 있음.
  sign: (user) => {
    const accessTokenPayload = {
      // 토큰내 들어갈 정보. (가벼운 정보만 넣기)
      type: "access",
      user: {
        _id: user._id,
        email: user.email,
        name: user.name,
        role: user.role,
      },
    };
    const refreshTokenPayload = {
      type: "refresh",
      user: {
        _id: user._id,
        email: user.email,
        name: user.name,
        role: user.role,
      },
      canRefresh: true,
    };
    const result = {
      // jsonsebtoken라이브러리의 sign 메소드를 통해 access token 발급!
      // jwt.sign( { 토큰이 가질 데이터(payload), 비밀 키, 옵션, 콜백함수(보통 에러 핸들링에 사용) } )
      accessToken: jwt.sign(accessTokenPayload, secretKey, accessTokenOption),
      refreshToken: jwt.sign(
        refreshTokenPayload,
        secretKey,
        refreshTokenOption
      ),
    };
    return result;
  },

  verify: (token) => {
    let decodedPayload;
    try {
      // verify를 통해 값 decode!
      decodedPayload = jwt.verify(token, secretKey);
    } catch (error) {
      // ! 이미 시스템 내부에서 err 메세지('jwt expired', 'invalid token')를 정의해 놓음.
      return {error}
    }
    return decodedPayload;
  },

  refreshVerify: (refreshToken, userId) => {
    if (!refreshToken)
      throw new AppError(
        "no refresh token",
        "리프레시 토큰이 없습니다. 다시 로그인 해주세요.",
        401
      );
    return jwt.verify(refreshToken, secretKey, (error, result) => {
      if (error) return {error} // 시간계산 로직을 쓰면 더 세분화됨.
      if (result.user._id === userId) {
        const accessTokenPayload = {
          // 토큰내 들어갈 정보. (가벼운 정보만 넣기)
          type: "access",
          user: {
            _id: result.user._id,
            email: result.user.email,
            name: result.user.name,
            role: result.user.role,
          },
        };
        const newAccessToken = jwt.sign(accessTokenPayload, secretKey, accessTokenOption);
        return {newAccessToken};
      }
    });
  },
};
