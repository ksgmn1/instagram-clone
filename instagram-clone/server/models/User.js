// 몽고DB용 ODM(Object Document Model)
const mongoose = require("mongoose")
const Schema = mongoose.Schema;
// JSON 웹토큰 처리
const jwt = require("jsonwebtoken");
// 암호화 기능 제공
const crypto = require("crypto");
// Post 모델
const Post = require("./Post");
// Following 모델
const Following = require("./Following");
const { createPath } = require("react-router-dom");

/*
    스키마 (Schema)
    컬렉션의 구조

    * 컬렉션
    NoSQL 데이터베이스 구조에서 데이터를 분류하는 기준
    RDB의 테이블에 해당한다
*/

const userSchema = new Schema({
    // 이메일
    email : {type: String, minLength : 5},
    // 비밀번호
    password : {type: String, minLength: 5},
    // 비밀번호 암호화에 사용되는 키
    salt: {type: String},
    // 아이디
    username : {type:String, minLength:3, required:true},
    // 이름
    name : {type:String},
    // 프로필 사진
    avatar : {type: String, default: "default.png"},
    // 자기소개
    bio : {type:String}
}, {
    // 데이터 송수신에 필요한 옵션
    toJSON: {virtuals : true},
    toObject: {virtuals:true}
});

/*
    가상 필드(Virtual field)

    필요할 경우 스키마에 가상 필드를 추가할 수 있다
    가상필드는 실제 데이터베이스에 존재하지 않는다.
*/

// 프로필 사진 URL
userSchema.virtual("avatarUrl").get(function () {
    return process.env.FILE_URL + "/avatar/" + this.avatar;
})

// 유저의 게시물 갯수
userSchema.virtual("postCount", {
    ref : "Post", // Post 모델 참조
    localField: "_id", // 기본키 - 모델 연결의 기준
    foreignField : "user", // 외래키 - 모델 연결의 기준
    count:true
})

// 팔로워 수
userSchema.virtual("followerCount", {
    ref:"Following", // Following 모델 참조
    localField: "_id",
    foreignField: "following",
    count : true
})

// 팔로잉 수
userSchema.virtual("followingCount", {
    ref:"Following", // Following 모델 참조
    localField: "_id",
    foreignField: "user",
    count : true
})

// 로그인 유저가 프로필 유저를 팔로우 하는지 여부
userSchema.virtual("isFollowing", {
    ref:"Following", // Following 모델 참조
    localField: "_id",
    foreignField: "following",
    justOne : true
})


/*
    Operation

    스키마의 데이터를 가공하고 처리한다.
*/

// 비밀번호 암호화
userSchema.methods.setPassword = function(password) {
    // 비밀번호 암호화에 사용되는 키
    this.salt = crypto
    .randomBytes(16).toString("hex");

    // 암호화
    this.password = crypto
    .pbkdf2Sync(password, this.salt, 310000, 32, "sha256")
    .toString("hex")
}

// 비밀번호 검사
userSchema.methods.checkPassword = function(password) {
    // 암호화된 비밀번호
    const hashedPassword = crypto
    .pbkdf2Sync(password, this.salt,310000,32, "sha256")
    .toString("hex");
    console.log(hashedPassword)
    // this.password  - 유저가 가입시에 입력한 비밀번호를 암호화한 값 (DB에 저장된 값)
    // hashedPassword - 로그인시에 입력한 비밀번호를 암호화한 값
    return this.password === hashedPassword; // 일치할 경우 로그인 성공
}

// 로그인 토큰 생성
userSchema.methods.generateJWT = function() {

    // 유저 데이터
    const payload = {
        sub : this._id,
        username : this.username
    }

    // 로그인 토큰 생성에 사용되는 키
    const secret = process.env.SECRET;

    // 토큰 생성
    return jwt.sign(payload, secret);
}

// 모델 exports
module.exports = mongoose.model("User", userSchema);