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
  try {
    const queryObj = { ...req.query };
    const excludeFields = ["page", "sort", "limit", "fields"];
    excludeFields.forEach((el) => delete queryObj[el]);

    // Handle array parameters
    if (req.query.supertype) {
      queryObj.supertype = { $in: req.query.supertype.split(",") };
    }
    if (req.query.subtypes) {
      queryObj.subtypes = { $in: req.query.subtypes.split(",") };
    }


    // Filtering
    const query = PokemonCard.find(queryObj);

    // Sorting
    if (req.query.sort) {
      const sortBy = req.query.sort.split(",").join(" ");
      query.sort(sortBy);
    } else {
      query.sort("createdAt");
    }

    // Limiting the fields
    if (req.query.fields) {
      const fields = req.query.fields.split(",").join(" ");
      query.select(fields);
    } else {
      query.select("-__v");
    }

    // Pagination
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 0;
    const skip = (page - 1) * limit;
    query.skip(skip).limit(limit);

    // Execute the query
    const pokemonCards = await query;

    // Get total count for pagination
    const totalPokemonCardsCount = await PokemonCard.countDocuments(queryObj);

    res.json({
      data: pokemonCards,
      total: totalPokemonCardsCount,
      page,
      limit,
    });
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
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