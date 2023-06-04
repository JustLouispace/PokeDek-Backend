const asyncHandler = require("express-async-handler");
const PokemonCard = require('../model/PokemonCardModel');
const slugify = require("slugify");
const { query } = require("express");
const User = require('../model/userModel');



const createPokemonCard = asyncHandler(async (req, res) => {
  console.log(req)
  try {
    if (req.body.name) {
      req.body.slug = slugify(req.body.name);
    }
    const newPokemonCard = await PokemonCard.create(req.body);
    res.json(newPokemonCard);
  }
  catch (error) {
    throw new Error(error);
  }
  res.json({
    message: "PokemonCard posted"
  });
});


const updatePokemonCard = asyncHandler(async (req, res) => {
  const id = req.params.id;
  try {
    if (req.body.name) {
      req.body.slug = slugify(req.body.name);
    }
    const updatedPokemonCard = await PokemonCard.findByIdAndUpdate(
      id,
      req.body,
      { new: true }
    );
    res.json(updatedPokemonCard);
  } catch (error) {
    throw new Error(error);
  }
});

const deletePokemonCard = asyncHandler(async (req, res) => {
  const id = req.params.id;
  try {
    const deletedPokemonCard = await PokemonCard.findByIdAndDelete(id,);
    res.json(deletePokemonCard);
  } catch (error) {
    throw new Error(error);
  }
});


const getPokemonCard = asyncHandler(async (req, res) => {
  const { id } = req.params;
  try {


    const getPokemonCard = await PokemonCard.findById(id);
    res.json(getPokemonCard);
  }
  catch (error) {
    throw new Error(error);
  }
});

const getallPokemonCard = asyncHandler(async (req, res) => {
  // Flitering
  //http://localhost:5000/api/PokemonCard?types=Lightning
  try {
    const queryObj = { ...req.query };
    const excludeFields = ["page", "sort", "limit", "fields"];
    excludeFields.forEach((el) => delete queryObj[el]);
    console.log(queryObj);
    let queryStr = JSON.stringify(queryObj);
    queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, (match) => `$${match}`);

    let query = PokemonCard.find(JSON.parse(queryStr));

    //sorting
    //http://localhost:5000/api/PokemonCard?sort=types,hp
    if (req.query.sort) {
      const sortBy = req.query.sort.split(',').join(' ');
      query = query.sort(sortBy);
    } else {
      query = query.sort('createdAt');
    }

    // Limiting the fields
    // http://localhost:5000/api/PokemonCard?fields=name,supertype,subtypes,hp,types,evolvesFrom
    if (req.query.fields) {
      const fields = req.query.fields.split(',').join(' ');
      query = query.select(fields);
    } else {
      query = query.select("-__v")
    }

    //pagination
    //http://localhost:5000/api/PokemonCard?page=2&limit=3
    const page = req.query.page;
    const limit = req.query.limit;
    const skip = (page - 1) * limit;
    query = query.skip(skip).limit(limit);
    if (req.query.page) {
      const pokemonCardCount = await PokemonCard.countDocuments();
      if (skip >= pokemonCardCount) throw new Error("This Page does not exists");
    }
    console.log(page, limit, skip);

    const pokemonCards = await query;
    res.json(pokemonCards);


  } catch (error) {
    throw new Error(error);
  }
});

const addToMyCollection = asyncHandler(async (req, res) => {
  console.log(req);
  console.log(res);
  const { _id } = req.user;
  const { prodId } = req.body;
  console.log(_id, prodId);
  try {
    const user = await User.findById(_id);
    const alreadyadded = user.MyCollection.find((id) => id.toString() === prodId);
    if (alreadyadded) {
      let user = await User.findByIdAndUpdate(
        _id,
        {
          $pull: { MyCollection: prodId },
        },
        {
          new: true,
        }
      );
      res.json(user);
    } else {
      let user = await User.findByIdAndUpdate(
        _id,
        {
          $push: { MyCollection: prodId },
        },
        {
          new: true,
        }
      );
      res.json(user);
    }
  } catch (error) {
    throw new Error(error);
  }
});



module.exports = {
  createPokemonCard,
  getPokemonCard,
  getallPokemonCard,
  updatePokemonCard,
  deletePokemonCard,
  addToMyCollection,
}