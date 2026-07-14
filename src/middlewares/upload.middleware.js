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
});

module.exports = upload;

// destination → where the file is stored.
// filename → what the file will be called.
// cb → callback function.
// file.originalname → the original image name.
