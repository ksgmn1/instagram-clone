// 라우터
const express = require("express");
const router = express.Router();
// 하위라우터
const userRouter = require("./user");
const postRouter = require("./post");
const commentRouter = require("./comment");
const profileRouter = require("./profile");
// 인증처리 미들웨어
const auth = require("../middleware/auth");


// 인덱스 페이지
router.get("/", (req, res) => {
  // 서버의 응답
  res.json({ message : "hello client"});
})


// 라우터 통합

// User Router
router.use("/users", userRouter);
// Post Router (보호된 라우터) -> 미들웨어 있기 때문
router.use("/posts", auth, postRouter);
// Comment Router (보호된 라우터) -> 미들웨어 있기 때문
router.use("/posts", auth, commentRouter);
// Profile Router (보호된 라우터) -> 미들웨어 있기 때문

router.use("/profiles", auth, profileRouter);

// 메인 라우터 exports
module.exports = router;