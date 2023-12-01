// 몽고DB용 ODM(Object Document Model)
const mongoose = require("mongoose")
const Schema = mongoose.Schema;
// 날짜 가공 기능
const { DateTime } = require("luxon")
// Comment 모델
const Comment = require("./Comment")
// Likes 모델
const Likes = require("./Likes")


// Post 스키마
const postSchema = new Schema({
    // 사진  (여러개일 수 있어서 [] 배열 형식)
    photos : [{type : String, required: true }],
    // 사진에 대한 설명
    caption: {type:String },
    // 게시물 작성자 (User모델과 조합)
    user : {type : Schema.ObjectId, required : true, ref: "User"},
    // 좋아요 갯수
    likesCount: {type: Number, default:0},
    
}, { // 옵션
    // 게시물 생성시간 자동저장
    timestamps: true,
    // 데이터 전송시에 필요한 옵션
    toJSON : {virtuals : true },
    toObject : {virtuals : true }
})


// 가상 필드

// 보여주기용 날짜
postSchema.virtual("displayDate").get(function () {
    const displayDate = DateTime
        // 도큐먼트 타임스탬프(createdAt)을 가공하여 보여주기용 날짜 생성
        .fromJSDate(this.createdAt)
        .toLocaleString(DateTime.DATE_MED);

    return displayDate;
})

// 사진 URL
postSchema.virtual("photoUrls").get(function () {
    const urls = this.photos.map(photoName => {
        // 완성된 URL을 제공한다
        return process.env.FILE_URL + "/photos/" + photoName
    })

    return urls;
})

// 댓글 갯수
postSchema.virtual("commentCount", {
    ref : "Comment", // Comment모델과 조인
    localField : "_id", // 기본키 - 컬렉션 조인의 기준
    foreignField : "post", // 외래키 - 컬렉션 조인의 기준
    count : true
})

// 로그인 유저의 게시물 좋아요 여부
postSchema.virtual("liked", {
    ref: "Likes", // Likes 모델과 조인
    localField : "_id", // 기본키
    foreignField : "post", // 외래키
    justOne : true
})

//  모델 exports
module.exports = mongoose.model("Post", postSchema);