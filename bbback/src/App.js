require("dotenv").config();

const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

/// ---필요한 라우터 require ---
const loginRouter = require("./routers/login");
// const accountRouter = require("./routers/account");
const registerRouter = require("./routers/register");
const graphRouter = require("./routers/graph");
/// -------------------------------

///----몽고DB 연결 ---------
mongoose.set("strictQuery", false);
mongoose.connect(process.env.MONGODB_URL);
mongoose.connection.on("connected", () => {
  console.log("정상적으로 DB와 연결되었습니다.   MongoDB Connected");
  console.log("--------------------------------------------");
});

///------------------------
const app = express();

// ------ 미들웨어 등록 ------
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
//------------------------

// ------ 라우터 등록 ------
app.use("/", graphRouter);
// app.use("/account", accountRouter);
app.use("/login", loginRouter);
app.use("/register", registerRouter);
//--------------------------

// ------ 오류처리 미들웨어 ------
app.use((err, req, res, next) => {
  res.json({
    result: "fail",
    message: err.message,
  });
});
//------------------------
///------서버 생성------------
const port = 8080;
app.listen(port, () =>
  console.log(`정상적으로 서버를 시작하였습니다. http://localhost:${port}`)
);
///--------------------------
module.exports = app;
