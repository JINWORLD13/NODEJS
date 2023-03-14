// 커스텀 에러 (내장함수 Error를 상속받아 만듦)
class AppError extends Error {
  constructor(name, message, statusCode) {
    super(message); // super는 Error를 뜻함.

    this.name = name;
    this.statusCode = statusCode ?? null;
    Error.captureStackTrace(this); // this는 AppError를 뜻함.
  }
}

module.exports = AppError;

// 사용법
// try문에서 if 문으로 발생할 수 있는 에러를 throw new Error("내용") 으로 처리하면 catch문의 err로 전달되고 "내용"은 err.message의 값이 됨.
// try-catch문의 catch문에서 err를 next(new AppError("에러제목", 상태코드, err.message))로 쓰기. -> 그러면 전역 미들웨어로 이 에러 객체가 전달됨.
// 예시 : new AppError("Validation Error", 400, "인풋 값이 잘못되었습니다.");
