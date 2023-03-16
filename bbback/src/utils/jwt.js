const jwt = require("jsonwebtoken");
const AppError = require("./AppError");
const buildResponse = require("./buildResponse");
const secretKey = require("../config/secretKey").secretKey;
const accessTokenOption = require("../config/secretKey").accessTokenOption;
const refreshTokenOption = require("../config/secretKey").refreshTokenOption;
const TOKEN_EXPIRED = 2;
const TOKEN_INVALID = 1;

module.exports = {
  // 이 sign은 jsonwebtoken 모듈의 sign이 아니다. 다시 정의하고 있음.
  sign: async (user) => {
    const accessTokenPayload = {
      // 토큰내 들어갈 정보. (가벼운 정보만 넣기)
      type: "JWT",
      user: {
        _id: user._id,
        email: user.email,
        name: user.name,
        role: user.role,
      },
    };
    const result = {
      // jsonsebtoken라이브러리의 sign 메소드를 통해 access token 발급!
      // jwt.sign( { 토큰이 가질 데이터(payload), 비밀 키, 옵션, 콜백함수(보통 에러 핸들링에 사용) } )
      accessToken: await jwt.sign(
        accessTokenPayload,
        secretKey,
        accessTokenOption
      ),
      refreshToken: await jwt.sign({}, secretKey, refreshTokenOption),
    };
    return result;
  },

  verify: async (token) => {
    let decodedPayload;
    try {
      // verify를 통해 값 decode!
      decodedPayload = await jwt.verify(token, secretKey);
    } catch (err) {
      // ! 이미 시스템 내부에서 err 메세지('jwt expired', 'invalid token')를 정의해 놓음.
      if (err.message === "jwt expired") {
        // ! 해당 에러나면 verify() 리턴값이 이게 되네.
        return TOKEN_EXPIRED;
      } else if (err.message === "invalid token") {
        return TOKEN_INVALID;
      } else {
        return TOKEN_INVALID;
      }
    }
    return decodedPayload;
  },

  refreshVerify: async (req, res, next) => {
    // access token과 refresh token의 존재 유무를 체크합니다.
    if (req.headers.authorization && req.headers.refresh) {
      const accessToken = req.headers.authorization.split("Bearer ")[1];
      const refreshToken = req.headers.refresh;

      // access token 검증 -> expired여야 함.
      const authResult = verify(accessToken);

      // access token 디코딩하여 user의 정보를 가져옵니다.
      const decoded = jwt.decode(accessToken);

      // 디코딩 결과가 없으면 권한이 없음을 응답.
      if (decoded === null) {
        return res.status(401).send({
          type: false,
          message: "권한이 없습니다!",
        });
      }

      /* access token의 decoding 된 값에서
          유저의 아이디를 가져와 refresh token을 검증합니다. */
      const refreshResult = refreshVerify(refreshToken, decoded.email);

      // 재발급을 위해서는 access token이 만료되어 있어야합니다.
      if (authResult.ok === false && authResult.message === "jwt expired") {
        // 1. access token이 만료되고, refresh token도 만료 된 경우 => 새로 로그인해야합니다.
        if (refreshResult.ok === false) {
          res.status(401).json({
            type: false,
            message: "새로 로그인해야 합니다.",
          });
        } else {
          // 2. access token이 만료되고, refresh token은 만료되지 않은 경우 => 새로운 access token을 발급
          const newAccessToken = sign(decoded.email);
          const result = {
            newAccessToken,
            refreshToken,
          };
          return result;
        }
      } else {
        // 3. access token이 만료되지 않은경우 => refresh 할 필요가 없습니다.
        return next(
          new AppError(
            "no invalid access token error",
            "Access Token이 만료되지 않았습니다.",
            400
          )
        );
      }
    } else {
      // access token 또는 refresh token이 헤더에 없는 경우
      next(
        new AppError(
          "no tokens error",
          "Access Token 및 Refresh Token이 없습니다.",
          400
        )
      );
    }
  },
};
