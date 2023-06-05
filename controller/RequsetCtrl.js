const Request = require('../model/RequestModel')
const asyncHandler = require("express-async-handler");

const createRequest = asyncHandler(async (req, res) => {
    console.log(req)
    try {
        const newRequest = await Request.create(req.body);
        res.json(newRequest);
    }
    catch (error) {
        throw new Error(error);
    }
    res.json({
        message: "PokemonCard posted"
    });
});


const updateRequest = asyncHandler(async (req, res) => {
    const id = req.params.id;
    try {
        const updatedRequest = await Request.findByIdAndUpdate(
            id,
            req.body,
            { new: true }
        );
        res.json(updatedRequest);
    } catch (error) {
        throw new Error(error);
    }
});

const deleteRequest = asyncHandler(async (req, res) => {
    const id = req.params.id;
    try {
        const deleteRequest = await Request.findByIdAndDelete(id,);
        res.json(deleteRequest);
    } catch (error) {
        throw new Error(error);
    }
});

const getRequest = asyncHandler(async (req, res) => {
    const { id } = req.params;
    try {


        const getRequest = await Request.findById(id);
        res.json(getRequest);
    }
    catch (error) {
        throw new Error(error);
    }
});


const getallRequest = asyncHandler(async (req, res) => {
    try {
      const requests = await Request.find();
      res.json(requests);
    } catch (error) {
      throw new Error(error);
    }
  });
  


module.exports = { createRequest, updateRequest, deleteRequest, getRequest, getallRequest }


