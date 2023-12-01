// 프레임워크
const express = require("express");
// 라우터
const router = express.Router();
// User Controller
const {
    create,
    login,
    update
} = require("../controllers/userController");

// 회원가입/로그인 미들웨어
const signUpValidator = require("../middleware/signUpValidator");
const loginValidator = require("../middleware/loginValidator");
// 파일처리 미들웨어
const upload = require("../middleware/upload");
// 인증처리 미들웨어
const auth = require("../middleware/auth");

/*
    express 라우터 사용방법

    router.httpRequestMethod(url, middlewares, controller)
*/

// 라우팅
router.post("/", signUpValidator, create);
router.post("/login", loginValidator, login);
router.put("/user", auth, upload.single("avatar"), update);

// 라우터 exports
module.exports = router;

