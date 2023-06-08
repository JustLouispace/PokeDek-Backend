const express = require("express");
const { uploadImages, deleteImages } = require("../controller/uploadCtrl");
const { isAdmin, authMiddleware } = require("../middlewares/authMiddleware");
const { uploadPhoto, productImgResize } = require("../middlewares/uploadimages");
const router = express.Router();

router.post(
    "/",
    authMiddleware,
    uploadPhoto.array("images", 10),
    productImgResize,
    uploadImages
);

router.delete("/delete-img/:id", authMiddleware, deleteImages);

module.exports = router;