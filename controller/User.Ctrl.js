const { generateToken } = require('../config/jwtToken');
const User = require('../model/userModel');
const asyncHandler= require("express-async-handler");
const validateMongodbID = require('../utils/validateMongodbId');
const { generateRefreshToken } = require('../config/refreshtoken');
const jwt = require('jsonwebtoken');
const validateMongoDbId = require('../utils/validateMongodbId');
const sendEmail = require('../controller/EmailCtrl');
const crypto = require("crypto");




//create email if no email in db
const createUser = asyncHandler(async(req, res) => {
    const email = req.body.email;
    const findUser = await User.findOne({email:email});
    if(!findUser) {
        const newUser = await User.create(req.body);
        res.json(newUser);
    } else{
        throw new Error('User Already Exists')
    }
});

//Login and check password and email when login
const loginUserCtrl = asyncHandler(async(req, res) =>{
    const { email,password } = req.body;
    const findUser = await User.findOne({ email });
    if (findUser && (await findUser.isPasswordMatched(password))) {
      const refreshToken = await generateRefreshToken(findUser?._id);
      const updateuser = await User.findByIdAndUpdate(
        findUser.id,
    {
        refreshToken: refreshToken,
    },
    { new: true }
    );
    res.cookie("refreshToken", refreshToken, {
        httpOnly: true,
        maxAge: 72 * 60 * 60 * 1000,
      });
      res.json({
        id : findUser?._id,
        firstname: findUser?.firstname,
        lastname: findUser?.lastname,
        email: findUser?.email,
        mobile: findUser?.mobile,
        token: generateToken(findUser?._id),
    });
    } else {
        throw new Error('Invalid Credentials');
    }
});

// handle refresh Token
const handleRefreshToken = asyncHandler(async (req, res) => {
    const cookie = req.cookies;
    if (!cookie?.refreshToken) throw new Error("No Refresh Token in Cookies");
    const refreshToken = cookie.refreshToken;
    const user = await User.findOne({ refreshToken });
    if (!user) throw new Error(" No Refresh token present in db or not matched");
    jwt.verify(refreshToken, process.env.JWT_SECRET, (err, decoded) => {
      if (err || user.id !== decoded.id) {
        throw new Error("There is something wrong with refresh token");
      }
      const accessToken = generateToken(user?._id);
      res.json({ accessToken });
    });
  });


//logout 

const logout = asyncHandler(async (req, res) => {
    const cookie = req.cookies;
    if (!cookie?.refreshToken) throw new Error("No Refresh Token in Cookies");
    const refreshToken = cookie.refreshToken;
    const user = await User.findOne({ refreshToken });
    if (!user) {
      res.clearCookie("refreshToken", {
        httpOnly: true,
        secure: true,
      });
      return res.sendStatus(204); // forbidden
    }
    await User.findOneAndUpdate({ refreshToken }, {
        refreshToken: "",
    });
    res.clearCookie("refreshToken", {
      httpOnly: true,
      secure: true,
    });
    res.sendStatus(204); // forbidden
  });







//get all user
 
const getallUser = asyncHandler(async (req, res) => {
    try{
        const getUser = await User.find()
        res.json(getUser)
    }
    catch (error){
        throw new Error(error)
    }
});

//get single user
const getUser = asyncHandler(async (req, res) => {
    const{id} = req.params;
    validateMongodbID(id);
    try {
        const getUser = await User.findById(id);
        res.json({
        getUser,
        })
    }
    catch(error){
        throw new Error(error)
    }
});

//delete single user
const deleteUser = asyncHandler(async (req, res) => {
    const{id} = req.params;
    validateMongodbID(id);
    try {
        const deleteUser = await User.findByIdAndDelete(id);
        res.json({
        deleteUser,
        })
    }
    catch(error){
        throw new Error(error)
    }
});

//update user
const updateUser = asyncHandler(async (req, res) => {
    console.log();
    const{ id } = req.user;
    validateMongodbID(id);
    try {
        const updateUser = await User.findByIdAndUpdate(
            id,
            {
            firstname: req?.body?.firstname,
            lastname: req?.body?.lastname,
            email: req?.body?.email,
            mobile: req?.body?.mobile,
            },
            {
                new: true
            }
        );
        res.json(updateUser);
    }
    catch(error){
        throw new Error(error)
    }
});

const blockUser = asyncHandler(async(req, res) => {
    const {id} = req.params;
    validateMongodbID(id);
    try{
        const block = await User.findByIdAndUpdate(
        id, 
        {
            isBlocked: true,
        },
        {
            new: true,
        }
    );
    res.json({
        message:" User Blocked",
    });
    }catch(error){
        throw new Error(error);
    }
});


const unblockUser = asyncHandler(async(req, res) => {
    const { id } = req.params;
    validateMongodbID(id);
    try{
        const unblock = await User.findByIdAndUpdate(
        id, 
        {
            isBlocked: false,
        },
        {
            new: true,
        }
        );
        res.json({
            message:" User Unblocked",
        });
    }catch(error){
    throw new Error(error);
}
});

const updatePassword = asyncHandler(async (req, res) => {
    const { _id } = req.user;
    const { password } = req.body;
    validateMongoDbId(_id);
    const user = await User.findById(_id);
    if (password) {
      user.password = password;
      const updatedPassword = await user.save();
      res.json(updatedPassword);
    } else {
      res.json(user);
    }
  });

  const forgotPasswordToken = asyncHandler(async (req, res) => {
    const { email } = req.body;
    const user = await User.findOne({ email });
    if (!user) throw new Error("User not found with this email");
    try {
      const token = await user.createPasswordResetToken();
      await user.save();
      const resetURL = `Hi, Please follow this link to reset Your Password. This link is valid till 10 minutes from now. <a href='http://localhost:5000/api/user/reset-password/${token}'>Click Here</>`;
      const data = {
        to: email,
        text: "Hey User",
        subject: "Forgot Password Link",
        htm: resetURL,
      };
      sendEmail(data);
      res.json(token);
    } catch (error) {
      throw new Error(error);
    }
  });

  const resetPassword = asyncHandler(async (req, res) => {
    const { password } = req.body;
    const { token } = req.params;
    const hashedToken = crypto.createHash('sha256').update(token).digest('hex');
    
    const user = await User.findOne({
      passwordResetToken: hashedToken,
      passwordResetExpires: { $gt: Date.now() },
    });
  
    if (!user) {
      throw new Error('Token is invalid or has expired. Please try again.');
    }
    
    user.password = password;
    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;
  
    await user.save();
  
    res.json({
      success: true,
      message: 'Password reset successfully.',
    });
  });


 module.exports={createUser, loginUserCtrl, getallUser ,getUser, deleteUser, 
    updateUser, blockUser, unblockUser, handleRefreshToken, logout, updatePassword, 
    forgotPasswordToken, resetPassword};

 