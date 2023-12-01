 const express = require("express");
const router = express.Router();
// Post Controller
const {
  feed,
  find,
  create,
  findOne,
  deleteOne,
  like,
  unlike,
} = require("../controllers/postController");
// 파일 처리 미들웨어
const upload = require("../middleware/upload");


// 라우팅
router.get("/feed", feed)
router.get("/", find)
router.post("/", upload.array("photos", 10), create) // 사진의 갯수 10개까지
router.get("/:id", findOne)
router.delete("/:id", deleteOne)
router.post("/:id/like", like)
router.delete("/:id/unlike", unlike)

module.exports = router;
