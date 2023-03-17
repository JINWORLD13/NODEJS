const AppError = require("./AppError");
const buildResponse = require("./buildResponse");
const { verify, refreshVerify } = require("./jwt");
const jwt = require("jsonwebtoken");

const checkTokenWithRefresh = async (req, res, next) => {
  // access token과 refresh token의 존재 유무를 체크합니다.
  try {
    if (req.headers["authorization"] && req.headers["refresh-token"]) {
      const accessToken = req.headers["authorization"].slice(7);
      const refreshToken = req.headers["refresh-token"];

      // access token 검증 -> expired여야 함(jwt.decode의 결과와 같은 payload가 나오지만, 여기선 서명 검증하니 expired 혹은 invaild시 그에 맞는 반환값을 반환해 상태 확인도 추가적으로 해줌.).
      const accessTokenVerifyResult = verify(accessToken);

      // access token 디코딩하여 user의 정보를 가져옵니다. decode는 (verify와 달리 비밀키 사용해 서명검증 없이) payload 반환.
      const decodedAccessTokenPayload = jwt.decode(accessToken);

      // 단순 서명없이 나오는 페이로드(디코딩 결과)가 없으면 권한이 없음(토큰이 없거나 형식이 다른 수상한 토큰이거나)을 응답.
      if (
        decodedAccessTokenPayload === null ||
        decodedAccessTokenPayload === undefined
      ) {
        next(new AppError("no authorization", "권한이 없습니다!", 401));
      }

      req.user = decodedAccessTokenPayload.user; // ! (중요) req로 verify한 user정보를 req에 넘겨줌.

      /* access token의 decoding 된 값에서
          유저의 이메일을 가져와 refresh token을 검증합니다. */
      const newAccessToken = refreshVerify(
        refreshToken,
        decodedAccessTokenPayload.user._id
      );
      console.log("newAccessToken", newAccessToken);

      // 재발급을 위해서는 access token이 만료되어 있어야합니다.
      if (accessTokenVerifyResult?.message === "jwt expired") {
        // 1. access token이 만료되고, refresh token도 만료(혹은 유효하지 않은 경우도) 된 경우 => 새로 로그인해야합니다.
        if (
          newAccessToken?.message === "jwt expired" ||
          newAccessToken?.message === "invalid token"
        ) {
          next(
            new AppError(
              "no authorization",
              "다시 로그인해주시길 바랍니다.",
              401
            )
          );
        } else {
          // 2. access token이 만료되고, refresh token은 만료되지 않은 경우 => 새로운 access token을 발급
          const data = {
            newAccessToken,
            refreshToken,
          };
          res.status(200).json(buildResponse(data, 200, null)); //! newAccessToken 줌(여기서 중요)(받으면 다시 재 시도 해야 함. 프론트에서)
        }
      } else {
        // 3. access token이 만료되지 않은경우 => refresh 할 필요가 없습니다.
        next();
      }
    } else {
      // access token 또는 refresh token이 헤더에 없는 경우
      next(
        new AppError(
          "no tokens error",
          "Access Token 혹은 Refresh Token이 없습니다.",
          400
        )
      );
    }
  } catch (err) {
    next(err);
  }
};

module.exports = checkTokenWithRefresh;
