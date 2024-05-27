const express = require("express");
const { upload } = require("../middlewares/multer");
const {
  addUser,
  valideAccount,
  login,
  messageRecovery,
  validePassword,
  newPassword,
  adminSearchUser,
  userDisable,
} = require("../User");
const {
  verifRegister,
  verifLogin,
  verifRecovery,
  verifNewPassword,
  verifSearchUser,
} = require("../middlewares/middelwares");

const router = express.Router();

router.post("/addUser", upload.single("image"), verifRegister, addUser);
router.get("/validAccount/:token", valideAccount);
router.post("/login", verifLogin, login);
router.post("/sendRecovery", verifRecovery, messageRecovery);
router.get("/changePassword/:token", validePassword);
router.patch("/newPassword", verifNewPassword, newPassword);
router.post("/searchProfile", verifSearchUser, adminSearchUser);
router.patch("/userDisable", userDisable);

module.exports = router;
