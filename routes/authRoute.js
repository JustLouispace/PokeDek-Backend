const express = require('express');
const { createUser, blockUser, unblockUser, handleRefreshToken, logout, updatePassword, forgotPasswordToken, resetPassword, loginAdmin } = require('../controller/User.Ctrl');
const { loginUserCtrl } = require('../controller/User.Ctrl');
const { getallUser } = require('../controller/User.Ctrl');
const { getUser } = require('../controller/User.Ctrl');
const { deleteUser } = require('../controller/User.Ctrl');
const { updateUser } = require('../controller/User.Ctrl');
const { authMiddleware } = require('../middlewares/authMiddleware');
const { isAdmin } = require('../middlewares/authMiddleware');

const router = express.Router();

router.post("/register", createUser);
router.post("/forgot-password-token", forgotPasswordToken);
router.put("/reset-password/:token", resetPassword);
router.put("/password", authMiddleware, updatePassword);
router.post("/login", loginUserCtrl);
router.post("/admin-login", loginAdmin);
router.get("/all-user", getallUser);
router.get("/refresh", handleRefreshToken);
router.get("/logout", logout);
router.get("/:id", getUser);
router.delete("/:id", deleteUser);
router.put("/:edit-user", updateUser);
router.put("/block-user/:id", authMiddleware, isAdmin, blockUser);
router.put("/unblock-user/:id", authMiddleware, isAdmin, unblockUser);


module.exports = router;


