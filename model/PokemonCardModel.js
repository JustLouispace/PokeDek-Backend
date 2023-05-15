const mongoose = require('mongoose');

const PokemonCardSchema = new mongoose.Schema({
  id: {
    type: String,
    required: true,
    unique: true
  },
  name: {
    type: String,
    required: true,
    trim : true
  },
  slug: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
  },
  supertype: {
    type: String,
    required: true
  },
  subtypes:{
    type: String,
    required: true
  } ,
  hp: {
    type: String,
    required: true
  },
  types: {
    type: String,
    required: true
  },
  evolvesFrom: {
    type: String,
  },
  images: {
    small: String,
    large: String
  },
});

module.exports = mongoose.model('PokemonCard', PokemonCardSchema);

