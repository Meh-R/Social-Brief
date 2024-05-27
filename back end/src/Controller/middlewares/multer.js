const multer = require("multer");
const path = require("path");

const uploadDirectory = path.join(__dirname, "../uploads");

let newFileName;
let storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadDirectory);
  },
  filename: function (req, file, cb) {
    const imageName = file.originalname.split(".");
    newFileName = `${imageName[0]}-${Date.now()}${path.extname(
      file.originalname
    )}`;
    cb(null, newFileName);
  },
});

const maxSize = 5 * 1000 * 1000;

let upload = multer({
  storage: storage,

  fileFilter: function (req, file, cb) {
    var filetypes = /jpeg|jpg|png|gif|avif|svg|webp|webm/;
    var mimetype = filetypes.test(file.mimetype);

    var extname = filetypes.test(path.extname(file.originalname).toLowerCase());

    if (mimetype && extname) {
      return cb(null, true);
    }

    cb(
      "Error: File upload only supports the " +
        "following filetypes - " +
        filetypes
    );
  },
});

module.exports = { upload };
