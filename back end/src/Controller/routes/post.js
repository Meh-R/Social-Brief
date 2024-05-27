const express = require("express");
const { upload } = require("../middlewares/multer");
const { verifPost, verifSearchUser } = require("../middlewares/middelwares");
const {
  addPost,
  myAllPost,
  updatePost,
  postDelete,
  postComment,
  searchUserPost,
  likePost,
  bestPost,
  followUser,
  feedPost,
  allPost,
  adminDeletePost,
} = require("../Post");
const router = express.Router();

router.post("/addPost", upload.single("image"), verifPost, addPost);
router.post("/allMyPost", myAllPost);
router.get("/allPost", allPost);
router.post("/bestPost", bestPost);
router.patch("/updatePost", upload.single("image"), verifPost, updatePost);
router.delete("/delete", postDelete);
router.patch("/threads", verifPost, postComment);
router.post("/searchUser", verifSearchUser, searchUserPost);
router.patch("/like", likePost);
router.post("/followUser", followUser);
router.post("/newFeed", feedPost);
router.delete("/adminDelete", adminDeletePost);
module.exports = router;
