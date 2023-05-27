const express = require('express');
const { authMiddleware, isAdmin } = require('../middlewares/authMiddleware');
const { createBlog, updateBlog } = require('../controller/BlogCtrl');
const router = express.Router();

router.post('/', authMiddleware,isAdmin, createBlog)
router.put("/:id", authMiddleware, isAdmin, updateBlog);

module.exports =router;
