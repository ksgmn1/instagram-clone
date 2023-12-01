const JwtStrategy = require("passport-jwt").Strategy;
const ExtractJwt = require("passport-jwt").ExtractJwt;
// User 모델
const User = require("../models/User");
// 인증처리 기능
const passport = require("passport");
// 환경변수 사용환경 제공
require("dotenv").config();


// JWT Strategy(알고리즘) 옵션
const opts = {};
// JWT추출 옵션 - AuthHearder에서 Bearer 토큰 추출
opts.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
// SECRET 옵션
opts.secretOrKey = process.env.SECRET;


// JWT Strategy(알고리즘) 생성 및 정의
const jwtStrategy = new JwtStrategy(opts, async (payload, done) => {
    try {
        // payload에 저장된 정보를 가지고 DB에서 유저를 검색한다.
        const user = await User.findById(payload.sub);
        // Model.fintById(id) : id를 가지고 데이터를 검색한다

        // 인증 실패 - 401 Unauthorized(권한 없음)
        if( !user ) {
            return done(null, false);
        }

        // 인증 성공 - 다음 미들웨어 호출
        return done(null, user);

    } catch (err) {
        return done(err, false);
    }
})


// JWT Strategy 적용
passport.use(jwtStrategy);

// Strategy exports
module.exports = passport.authenticate("jwt", {session : false});