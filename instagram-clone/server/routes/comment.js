// 프레임워크, 라우터
const express = require("express");
const router = express.Router();
// Comment Controller
const {
  find,
  create,
  deleteOne
} = require("../controllers/commentController");

// 라우팅
router.get("/:id/comments", find)
router.post("/:id/comments", create)
router.delete("/comments/:id", deleteOne)

// 모듈 exports
module.exports = router;