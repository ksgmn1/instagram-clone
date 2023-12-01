// 프레임 워크
const express = require("express");
// 에러 처리 기능
const createError = require("http-errors");
// 쿠키 수집 가능
const cookieParser = require("cookie-parser");
// 통신 기록 보관 및 출력
const logger = require("morgan");
// CORS 기능 제공
const cors = require("cors");
// 메인 라우터
const indexRouter = require("./routes/index");
// 최상위 모듈
const app = express();
// 몽고DB용 ODM
const mongoose = require("mongoose");
// 압축 기능 제공
const compression = require("compression");
// 요청 헤더 보완 기능
const helmet = require("helmet");
// 환경변수 사용환경 제공
require("dotenv").config();


// 데이터베이스 연결
mongoose.set("strictQuery", false);
mongoose
  .connect(process.env.MONGODB_URI)
  .catch(err => console.log(err));


// 앱 레벨 미들웨어 적용
app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended : false}));
app.use(cookieParser());
app.use(compression());
app.use(helmet.crossOriginResourcePolicy({
  policy : "cross-origin"
}));
app.use(cors());


// 파일 저장 경로 설정

// 서버에서 사용하는 파일 저장
app.use("/api/static", express.static("public"));
// 업로드 파일 저장
app.use("/api/files", express.static("files"));


// 인덱스 라우터 호출
app.use("/api", indexRouter);

// 에러 처리

// 404 에러 처리
app.use((req, res, next) => {
  const err = new createError.NotFound("Invalid URL");

  next(err);
})

// error handler : 서버에서 발생하는 모든 에러를 처리한다.
app.use((err, req, res, next) => {
  console.error(err);
  // 클라이언트에 에러메시지 전달
  res.status(err.status || 500).json(err.message);
  // res.status(서버의 응답코드).json(전송할 데이터)
})

// app 모듈 exports
module.exports = app;
