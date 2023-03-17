const jwt = require("jsonwebtoken");
const redis = require("redis");
const redisClient = redis.createClient();
redisClient.on("error", (err) => {
  console.error("Redis error:", err);
});

redisClient.on('connect', () => {
  console.log('Redis redisClient connected')
});
const { promisify } = require("util");
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

  refreshVerify: async (refreshToken, userId) => {
    // refresh token 검증
    /* redis 모듈은 기본적으로 promise를 반환하지 않으므로,
       promisify를 이용하여 promise를 반환하게 해줍니다.*/
    const getAsync = await promisify(redisClient.get).bind(redisClient);
    console.log('getAsync', getAsync);

    try {
      const data = getAsync(userId); // refresh token 가져오기
      console.log("data", data);
      if (refreshToken === data) {
        try {
          jwt.verify(refreshToken, secretKey);
          console.log("여기2");
          return true;
        } catch (err) {
          console.log("여기3");
          return false;
        }
      } else {
        console.log("여기4");
        return false;
      }
    } catch (err) {
      console.log("여기5");
      return false;
    }
  },
};
