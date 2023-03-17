require("dotenv").config();

const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const AppError = require("./utils/AppError");
const buildResponse = require("./utils/buildResponse");

/// ---필요한 라우터 require ---
const loginRouter = require("./routers/login");
// const accountRouter = require("./routers/account");
const registerRouter = require("./routers/register");
const withdrawRouter = require("./routers/withdraw");
const modifyRouter = require("./routers/modify");
const userRouter = require("./routers/user");
const graphRouter = require("./routers/graph");
// const districtsRouter = require("./routers/districts");
/// -------------------------------

///----몽고DB 연결 ---------
mongoose.set("strictQuery", false);
mongoose.connect(process.env.MONGODB_URL);
mongoose.connection.on("connected", () => {
  console.log("정상적으로 DB와 연결되었습니다.   MongoDB Connected");
  console.log("--------------------------------------------");
});
mongoose.connection.on('error', (error) => {
  console.error('mongoDB connection error: ', error);
});
mongoose.connection.on('disconnected', () => {
  console.error('lost connection to mongoDB. trying to reconnect');
  mongoose.connect(process.env.MONGODB_URL); // 연결 재시도.
});

///------------------------
const app = express();

// ------ 미들웨어 등록 ------
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
//------------------------

// ------ 라우터 등록 ------
app.use("/graph", graphRouter);
// app.use("/account", accountRouter);
app.use("/login", loginRouter);
app.use("/register", registerRouter);
app.use("/withdraw", withdrawRouter);
app.use("/user", userRouter);
app.use("/modify", modifyRouter);
// app.use("/districts", districtsRouter);
//--------------------------

// ------ 오류처리 미들웨어 ------
// ! 페이지를 따로 설정하지 않은 것들은 전부 404 에러가 표시되도록 함.
app.use((_, __, next) => {
  next(new AppError("resourceNotFoundError", "Resource not found", 404));
}); 
app.use((err, req, res, next) => {
  res.json(buildResponse(null, err.statusCode, err));
});
//------------------------
///------서버 생성------------
app.listen(process.env.PORT, () =>
  console.log(`정상적으로 서버를 시작하였습니다. http://localhost:${process.env.PORT}`)
);
///--------------------------
module.exports = app;
