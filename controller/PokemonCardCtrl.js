const asyncHandler = require("express-async-handler");
const PokemonCard = require('../model/PokemonCardModel');
const slugify = require("slugify");

const createPokemonCard = asyncHandler(async(req, res) => {
    try{
        if(req.body.name){
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


const updatePokemonCard = asyncHandler(async(req, res) =>{
    const id = req.params;
    try {
        if(req.body.title){
            req.body.slug = slugify(req.body.name);
        }
    const updatePokemonCard = await PokemonCard.findByIdAndUpdate({ id }, req.body, {
        new: true,   
    });
    res.json(updatePokemonCard);
    } catch (error){
        throw new Error(error);
    }
}); 




const getPokemonCard = asyncHandler(async(req, res) => {
    const { id } = req.params;
    try{
        const getPokemonCard = await PokemonCard.findById(id);
        res.json(getPokemonCard);
    }  
    catch (error) {
        throw new Error(error);
    }
});

const getallPokemonCard = asyncHandler(async(req, res) => {
    try{
        const getallPokemonCard = await PokemonCard.find();
        res.json(getallPokemonCard);
    }
    catch (error) {
        throw new Error(error);
    }
});


module.exports = { createPokemonCard , getPokemonCard, getallPokemonCard, updatePokemonCard }