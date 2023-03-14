module.exports = {
  secretKey: process.env.SECRET_KEY, // 원하는 시크릿 키
  option: {
    algorithm: process.env.ALGORITHM, // 해싱 알고리즘
    expiresIn: "2h", // 토큰 유효 기간
    issuer: process.env.ISSUER, // 발행자
  },
};
