const express = require("express");
const { upload } = require("../middlewares/multer");
const { addUser, valideAccount } = require("../User");
const { verifRegister } = require("../middlewares/middelwares");
const router = express.Router();

router.post("/addUser", upload.single("image"), verifRegister, addUser);
router.get("/validAccount/:token", valideAccount);

module.exports = router;
