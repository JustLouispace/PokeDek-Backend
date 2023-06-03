const express = require('express');
const { createPokemonCard, getPokemonCard, getallPokemonCard, updatePokemonCard, deletePokemonCard, addToMyCollection, uploadImages } = require("../controller/PokemonCardCtrl");
const { isAdmin, authMiddleware } = require("../middlewares/authMiddleware");
const { uploadPhoto, productImgResize } = require('../middlewares/uploadimages');
const router = express.Router();

router.post("/", authMiddleware, isAdmin, createPokemonCard);
router.put("/upload/:id", authMiddleware, isAdmin, uploadPhoto.array('images', 10), productImgResize, uploadImages);
router.get("/:id", getPokemonCard);
router.put("/addtomycollection", authMiddleware, addToMyCollection);
router.put("/:id", authMiddleware, isAdmin, updatePokemonCard);
router.delete("/:id", authMiddleware, isAdmin, deletePokemonCard)
router.get("/", getallPokemonCard);
module.exports = router;

