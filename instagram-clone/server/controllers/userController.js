const User = require("../models/User");

/*
    User Controller

    1 create - 유저 생성
    2 login - 로그인
    3 update - 프로필 업데이트
*/

exports.create = async(req, res, next) => {
    try {

        // 클라이언트가 전송한 데이터
        const { email, name, username, password } = req.body;

        // User모델의 인스턴스 생성
        const user = new User();

        // 필드값 할당
        user.email = email;
        user.name = name;
        user.username = username;
        user.setPassword(password); // 비밀번호 암호화

        // 도큐먼트 저장
        await user.save();

        // 서버의 응답
        res.json({user});

    } catch (error) {
        next(error);
    }
};

exports.login = async(req, res, next) => { 
    try {
        // 유저가 로그인시에 입력한 이메일
        const { email } = req.body;

        // 이메일로 유저 검색
        const _user = await User.findOne({ email });

        // 로그인 토큰 생성
        const access_token = _user.generateJWT();

        // 전송할 유저데이터
        const user = {
            username : _user.username,
            name : _user.name,
            avatarUrl : _user.avatarUrl,
            bio : _user.bio,
            access_token
        }

        // 서버의 응답
        res.json({ user });

    } catch (error) {
        next(error);
    }
};

exports.update = async(req, res, next) => {
    try {

        // 로그인 유저
        const _user = req.user;

        // 유저가 프로필 사진을 업데이트 했을 때
        if (req.file) { // req.file : 클라이언트가 업로드한 파일
            // 필드 업데이트
            _user.avatar = req.file.filename;
        }

        // 이름 업데이트 요청을 했을 때
        if ("name" in req.body) { // key in Object
            // 필드 업데이트
            _user.name = req.body.name;
        }

        // 자기소개 업데이트 요청을 했을 때
        if ("bio" in req.body) {
            // 필드 업데이트
            _user.bio = req.body.bio;
        }

        // 변경사항 저장
        await _user.save();

        // 토큰 재발급
        const access_token = _user.generateJWT();

        // 전송할 유저 데이터
        const user = {
            username : _user.username,
            name : _user.name,
            avatarUrl : _user.avatarUrl,
            bio : _user.bio,
            access_token
        }

        // 서버의 응답
        res.json({ user });

    } catch (error) {
        next(error);
    }
};