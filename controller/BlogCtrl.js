const Blog = require("../model/BlogModel");
const User = require("../model/userModel");
const asyncHandler = require("express-async-handler");
const validateMongoDbId = require('../utils/validateMongodbId');

const createBlog  = asyncHandler(async(req, res) => {
    try {
        const newBlog = await Blog.create(req.body);
        res.json(newBlog);
      } catch (error) {
        throw new Error(error);
      }
});


const updateBlog = asyncHandler(async (req, res) => {
    const { id } = req.params;
    validateMongoDbId(id);
    try {
      const { _id, ...updateData } = req.body; // Exclude _id field from req.body
  
      const updatedBlog = await Blog.findByIdAndUpdate(id, updateData, {
        new: true,
      });
      res.json(updatedBlog);
    } catch (error) {
      throw new Error(error);
    }
  });



module.exports = { createBlog , updateBlog};
