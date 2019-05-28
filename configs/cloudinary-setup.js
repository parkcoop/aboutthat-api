const cloudinary = require("cloudinary");
const cloudinaryStorage = require("multer-storage-cloudinary");
const multer = require("multer");

cloudinary.config({
  cloud_name: "parkcoop",
  api_key: "174922639426728",
  api_secret: "oH-1Ud4gnvScAk9rBEPXqZ_-lDI"
});

const storage = cloudinaryStorage({
  cloudinary,
  folder: "aboutthat",
  allowedFormats: ["jpg", "png"],
  filename: function(req, res, cb) {
    cb(null, res.originalname);
  }
});

const uploader = multer({ storage });
module.exports = uploader;
