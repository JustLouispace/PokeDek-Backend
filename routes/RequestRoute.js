const express = require('express');
const { isAdmin, authMiddleware } = require("../middlewares/authMiddleware");
const { createRequest, updateRequest, deleteRequest, getRequest, getallRequest } = require('../controller/RequsetCtrl');
const router = express.Router();

router.post("/", createRequest);
router.get("/:id", getRequest);
router.put("/:id", updateRequest);

router.delete("/:id", deleteRequest)
router.get("/", getallRequest);
module.exports = router;

