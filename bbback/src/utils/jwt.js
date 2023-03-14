const randToken = require('rand-token');
const jwt = require('jsonwebtoken');
const secretKey = require('../config/secretKey').secretKey;
const option = require('../config/secretKey').option;
const TOKEN_EXPIRED = 2;
const TOKEN_INVALID = 1;

module.exports = {
    // 이 sign은 jsonwebtoken 모듈의 sign이 아니다. 다시 정의하고 있음.
    sign: async (user) => {
        const payload = { // 토큰내 들어갈 정보. (가벼운 정보만 넣기)
            type : 'JWT',
            user : {
                    _id : user._id,
                    email: user.email,
                    name: user.name,
                    role : user.role
                }
        };
        const result = {
            // jsonsebtoken라이브러리의 sign 메소드를 통해 access token 발급!
            // jwt.sign( { 토큰이 가질 데이터(payload), 비밀 키, 옵션, 콜백함수(보통 에러 핸들링에 사용) } )
            accessToken: await jwt.sign(payload, secretKey, option),
            refreshToken: randToken.uid(256)
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
            if (err.message === 'jwt expired') {
                // ! 해당 에러나면 verify() 리턴값이 이게 되네.
                return TOKEN_EXPIRED; 
            } else if (err.message === 'invalid token') {
                return TOKEN_INVALID;
            } else {
                return TOKEN_INVALID;
            }
        }
        return decodedPayload;
    }
}