const multer = require("multer");

//Store uploaded files on my computer.
const storage = multer.diskStorage({
  //where the file is stored.
  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },

  //what the file will be called.
  filename: (req, file, cb) => {
    const uniqueName = Date.now() + "_" + file.originalname;

    cb(null, uniqueName);
  },
});

const upload = multer({
  storage,

  limits: {
    fileSize: 5 * 1024 * 1024, // 5 MB
  },

  fileFilter: (req, file, cb) => {
    const allowedTypes = ["image/jpeg", "image/jpg", "image/png"];

    if (!allowedTypes.includes(file.mimetype)) {
      return cb(new Error("Only JPG and PNG images are allowed"));
    }

    cb(null, true);
  },
});

module.exports = upload;

// destination → where the file is stored.
// filename → what the file will be called.
// cb → callback function.
// file.originalname → the original image name.
