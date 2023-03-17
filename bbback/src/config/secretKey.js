module.exports = {
  secretKey: process.env.SECRET_KEY, // 원하는 시크릿 키
  accessTokenOption: {
    algorithm: process.env.ACCESSTOKENALGORITHM, // 해싱 알고리즘
    expiresIn: "3h", // 토큰 유효 기간
    issuer: process.env.ISSUER, // 발행자
  },
  refreshTokenOption: {
    algorithm: process.env.REFRESHTOKENALGORITHM, // 해싱 알고리즘
    expiresIn: "3w", // 토큰 유효 기간
    issuer: process.env.ISSUER, // 발행자
  },
};
