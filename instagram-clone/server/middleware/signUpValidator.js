// User 모델
const User = require("../models/User");
// 유효성 검사 기능 제공
const { body } = require("express-validator");
// 에러 처리 기능 제공
const createError = require("http-errors");


module.exports = async (req,res,next) => {
    try {

        //이메일 검사
        const emailResult = await body("email") // 유저가 입력한 값
        .isEmail() // 올바른 이메일인지 검사
        .custom(async (email) => {
            // 이메일로 유저 검색
            const user = await User.findOne({email});

            // 이메일이 중복된 경우 (이미 가입된 이메일)
            if( user ) {
                throw new Error("E-mail is already in use");
            }
        })
        .run(req);

        // 이메일 유효성 검사 실패 처리
        if (!emailResult.isEmpty()) {
            // 400 BadRequset (잘못된 요청) 처리
            throw new createError.BadRequest("E-mail validation failed");
        }

        // 아이디 검사
        const usernameResult = await body("username") // 유저가 입력한 값
        .trim() // 불필요한 공백제거
        .isLength({min : 5}) // 길이 검사(최소 5글자)
        .isAlphanumeric() // 알파벳(Alphabet) 또는 숫자(numeric) 인지 검사
        .custom(async (username) => { // 중복검사

            // 유저가 입력한 username으로 DB 검색
            const user = await User.findOne({ username });

            // 중복된 아이디
            if(user) {
                // 에러 처리
                throw new Error("Username is already in use");
            }
        })
        .run(req);

        // 아이디 유효성 검사 실패 처리
        if(!usernameResult.isEmpty()) {
            // 400 BadRequest(잘못된 요청) 처리
            throw new createError.BadRequest("Username validation failed");
        }

        // 비밀번호 검사
        const passwordError = await body("password")
        .trim()
        .isLength({min : 5})
        .run(req);

        // 비밀번호 유효성 검사 실패 처리
        if(!passwordError.isEmpty()) {
            // 400 BadRequest (잘못된 요청) 처리
            throw new createError.BadRequest("Password validation failed");
        }

        // 다음 미들웨어 호출
        next();
        
    }  catch(error){
        // 에러 핸들러에게 에러 전달
        next(error)
    }
}; 