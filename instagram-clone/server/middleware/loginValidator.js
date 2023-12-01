// User 모델
const User = require("../models/User");
// 유효성 검사 기능 제공
const { body } = require("express-validator");
// 에러 처리 기능 제공
const createError = require("http-errors");

/*
    req (request) : 요청 객체
    res (response) : 응답 객체
    next : 다음 미들웨어를 호출하는 함수
*/

// 모듈 정의 및 exports
module.exports = async (req, res, next) => {
    try {

        // 이메일 검사
        const emailResult = await body("email") // 유저가 입력한 이메일
        .isEmail() // 유효한 이메일인지 검사
        .custom(async (email) => { // 이메일의 존재여부 검사
            // 이메일로 DB에서 유저를 검색한다.
            const user = await User.findOne({email});
            // Model.findone(field) : field로 한개의 도큐먼트를 검색한다.

            // 유저가 존재하지 않을 경우(로그인 실패)
            if (!user) {
                // 401 Unauthorized(권한 없음) 에러 처리
                throw new createError.Unauthorized("E-mail does not exists");
            }
        })
        .run(req);

        // 이메일 유효성 검사 실패
        if( !emailResult.isEmpty()) {
            throw new createError.Unauthorized("E-mail validation failed");
        }

        // 비밀번호 검사
        const passwordResult = await body("password") // 유저가 입력한 값
        .trim() // 불필요한 공백 제거
        .notEmpty() // 값이 없는지 체크
        .custom(async (password, { req }) => {
            // 로그인을 시도한 이메일
            const email = req.body.email;
            // 이메일로 유저 검색
            const user = await User.findOne({ email });

            // 유저의 비밀번호와 로그인시에 입력한 비밀번호 비교
            if(!user.checkPassword(password)) {
                // 일치하지 않는 경우 401 Unautorized 에러 처리
                throw new createError.Unauthorized("Password does not match");
            }
        })
        .run(req)

        // 비밀번호 유효성 검사 실패 처리
        if(!passwordResult.isEmpty()) {
            // console.log(passwordResult.errors)
            throw new createError.Unauthorized("Password validation failed");
        }

        // 다음 미들웨어 호출
        next(); 

    } catch (error) {
        // 에러핸들러에게 에러를 전달한다.
        next(error); 
    }
}