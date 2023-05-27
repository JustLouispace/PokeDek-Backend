const mongoose = require("mongoose");


var blogSchema = new mongoose.Schema(
    {
      title: {
        type: String,
        required: true,
      },
      description: {
        type: String,
        required: true,
      },
      category: {
        type: String,
        required: true,
      },
      numViews: {
        type: Number,
        default: 0,
      },
      author: {
        type: String,
        default: "Admin",
      },
      images: [""],
    },
    {
      toJSON: {
        virtuals: true,
      },
      toObject: {
        virtuals: true,
      },
      timestamps: true,
    }
  );

  module.exports = mongoose.model("Blog", blogSchema);