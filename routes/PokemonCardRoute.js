const express= require('express');
const { createPokemonCard, getPokemonCard, getallPokemonCard, updatePokemonCard } = require("../controller/PokemonCardCtrl");
const router = express.Router();

router.post("/", createPokemonCard);
router.get("/:id", getPokemonCard);
router.put("/:id", updatePokemonCard);
router.get("/", getallPokemonCard);
module.exports = router;

