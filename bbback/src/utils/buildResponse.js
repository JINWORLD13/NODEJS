function buildResponse(data, statusCode, error) {
  return {
    data, // data : 1번째 인자 data 내용이 들어감.
    statusCode: statusCode,
    errorName: error?.name ?? null, //! (??는 ?와 반대) undefined 혹은 null이면 다음 꺼 반환
    errorMessage: error?.message ?? null //! ?.는 null 혹은 undefined이면 다음 메소드 혹은 필드 반환하지 않음.(null 값이 올때 읽을 수 있게 됨.)
    
  };
}

module.exports = buildResponse;