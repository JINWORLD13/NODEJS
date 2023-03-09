const express = require("express");
const cors = require("cors");

/// ---필요한 라우터 require ---
const loginRouter = require("./routers/login");
const accountRouter = require("./routers/account");
const registerRouter = require("./routers/register");
/// -------------------------------

const app = express();

// ------ 미들웨어 등록 ------
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
//------------------------

// ------ 라우터 등록 ------
app.use("/account", accountRouter);
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

module.exports = app;
