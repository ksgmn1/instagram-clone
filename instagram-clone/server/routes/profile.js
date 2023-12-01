const express = require("express")
const router = express.Router();
const {
  find,
  findOne,
  follow,
  unfollow
} = require("../controllers/profileController");

router.get("/", find)
router.get("/:username", findOne)
router.post("/:username/follow", follow)
router.delete("/:username/unfollow", unfollow)

module.exports = router;