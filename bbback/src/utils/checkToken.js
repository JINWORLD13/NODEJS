const jwt = require('./jwt');
const TOKEN_EXPIRED = 2;
const TOKEN_INVALID = 1;
const AppError = require('./AppError');

const checkToken = async (req, res, next) => {
    // 서버측에서 클라이언트로부터 받은 토큰을 가져와 처리해줌
    try{
        let token = req.headers['authorization'].slice(7);
        if (req.headers['authorization'] === null || req.headers['authorization'] === undefined) {
        // (크롬->F12->Network->request의 key가 authorization부분) Bearer Authentication의 접두사인 Bearer 문자열 제거
            throw new Error('토큰이 존재하지 않습니다.');
        }

        // 디코드(decode : jsonwebtoken의 메소드인 verify로 토큰 해석)
        // ! decodedPayload는 token의 payload임
        const decodedPayload = await jwt.verify(token);

        // (디코드 후) 검증 절차
        if (decodedPayload === TOKEN_EXPIRED) // 유효기간 만료이면 실행
            throw new Error('토큰이 만료되었습니다.')
        
        if (decodedPayload === TOKEN_INVALID) // 유효하지 않는 토큰이면 실행
            throw new Error('유효하지 않는 토큰입니다.',"invalid token error")

        if (decodedPayload?.user?.email === undefined || decodedPayload?.user?._id === undefined) // 이상한 토큰이면 실행
            throw new Error('수상한 토큰입니다.', "not verified token error")

        req.user = decodedPayload.user; // ! (중요) req로 verify한 user정보를 req에 넘겨줌.
        next(); // 다음 미들웨어로 통과.
    } catch (err){
        next(new AppError(err.name, err.message, 401));
        }
        
    }



module.exports = checkToken;
