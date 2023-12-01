// 파일 처리 기능
const multer = require("multer");
// 경로 관련 기능
const path = require("path");
// 에러 처리 기능
const createError = require("http-errors");

// multer 옵션
const opts = {};


// 1. Storage 옵션 (파일의 저장 위치, 파일 이름)
opts.storage = multer.diskStorage({
    // 파일의 저장 위치
    destination: (req, file, cb) => {
        // files/
        cb(null, `${__dirname}/../files/${file.fieldname}/`);
    },

    // 파일의 이름
    filename: (req, file, cb) => {
        // 파일의 확장자
        const extname = path.extname(file.originalname);
        // 랜덤 이름 생성
        const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9)

        // 완성된 파일이름을 콜백에 전달한다.
        cb(null, uniqueSuffix + extname);
    }
})

// 2. 필터 옵션
opts.fileFilter = (req, file, cb) => {
    // 확장자
    const extname = path.extname(file.originalname);
    let isError = false;

    // 이미지 파일인지 검사
    // jpg, jpeg, png 만 가능
    switch (extname) {
        case ".jpg" :
        case ".jpeg" :
        case ".png" :
            break;
        default:
            isError = true;
    }

    // 정해진 포맷이 아닌 경우
    if (isError) {
        // 400 BadRequest 에러 처리
        const err = new createError.BadRequest("Unacceptable type of file");
        return cb(err);
    }

    // 올바른 포맷인 경우 콜백
    cb(null, true);
}

// 3. 제한 옵션 (파일크기, 사이즈 등)
opts.limits = { fileSize : 1e7 }; // 10MB까지 가능

// 모듈 exports 및 옵션 적용
module.exports = multer(opts)