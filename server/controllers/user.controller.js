import { User } from "../models/user.model.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import {apiError} from "../utils/apiErrors.js"
import { cloudinaryFileUploader } from "../utils/Cloudinary.js";
import { apiResponse } from "../utils/apiResponse.js";
import jwt from "jsonwebtoken"

const generateAccessAndRefreshToken = async(userId) =>{
try {
    const user = await User.findById(userId)
    const accessToken = user.generateAccessToken()
    const refreshToken =  user.generateRefreshToken()
    user.refreshToken = refreshToken
    await user.save({validateBeforeSave: false})

    return {accessToken, refreshToken}
} catch (error) {
    throw new apiError(500, "something went wrong while generating refresh and access token")
}
}
const registerUser = asyncHandler(async (req, res) => {
    const { fullname, username, email, password, role } = req.body;
    if(
        [fullname, username, email, password, role].some((field)=>field?.trim === "")
    ){
        throw new apiError(500, "All field required")
    }
    const existedUser = await User.findOne({
        $or : [{username}, {email}]
    })
    if(existedUser){
        throw new apiError(409, "User already exist")
    }
   let profilePictureLocalPath;
   if(req.file && Array.isArray(req.files.profilePicture) && req.files.profilePicture > 0){
    profilePictureLocalPath = req.file.profilePicture[0].path
   }
    
   const profileCloud = await cloudinaryFileUploader(profilePictureLocalPath)

   
 const user = await User.create({
    fullname,
    profilePicture: profileCloud?.url || "",
    email,
    password,
    username: username.toLowerCase(),
    role: role.toLowerCase(),
   })
  const createdUser =  await User.findById(user._id).select(
    "-password -refreshToken"
  )
  if(!createdUser){
    throw new apiError(500, "something went wrong while registering the user")
  }
  return res.status(201).json(
    new apiResponse(200, createdUser, "user registered successfully")
  )
});
const loginUser = asyncHandler(async(req, res)=>{
  // const body = req.body
    const {email, username, password} = req.body
   if ((email && username) || (!email && !username)) {
  throw new apiError(400, "Either email or username is required, but not both");
}
       const user = await User.findOne({
        $or: [{email}, {username}]
       })
       if(!user){
        throw new apiError(404, "user not found")
       }
     const checkingPassword =  await user.isPasswordCorrect(password)
       if(!checkingPassword){
        throw new apiError(401, "invalid user credential")
       }
       const {accessToken, refreshToken} = await generateAccessAndRefreshToken(user._id)
       const loggedinUser = await User.findById(user._id).select("-password -refreshToken")
       
       const options = {
        httpOnly: true,
        secure: true
       }
       return res.status(200)
       .cookie("accessToken", accessToken, options)
       .cookie("refreshToken", refreshToken, options)
       .json(
        new apiResponse(
            200,{
                user: loggedinUser,
                accessToken,
                refreshToken
            },
            "User Loggedin Successfully"
        )
    )
 });
const logoutUser = asyncHandler(async(req, res) => {
      User.findByIdAndUpdate(
        req.user._id,
        {
          $set: {
            refreshToken: undefined
          },
        }
      )
      const options = {
        httpOnly: true,
        secure: true
      }
      return res.status(200)
      .clearCookie("accessToken", options)
      .clearCookie("refreshToken", options)
      .json(new apiResponse(200, {}, "User logged out successfully"))
})
const refreshAccessToken = asyncHandler(async(req, res)=>{
  try {
    const incomingRefreshToken = req.cookies.refreshToken || req.body.refreshToken
    if(!incomingRefreshToken){
      throw new apiError(401, "Unauthorized Request")
    }
  
    const decodedRefreshToken = jwt.verify(incomingRefreshToken, process.env.REFRESH_TOKEN_SECRET)
    const user = await User.findById(decodedRefreshToken?._id)
    if(!user){
      throw new apiError(401, "Invalid refresh token")
    }
    if(incomingRefreshToken !== user?.refreshToken){
      throw new apiError(401, "Refresh token is expired or used")
    }
    const option = {
      httpOnly: true,
      secure: true
    }
   const {accessToken, newRefreshToken} = await generateAccessAndRefreshToken(user._id)
    return res.status(200).cookies("accessToken", accessToken, option ).cookies("refreshToken", newRefreshToken, option).json(new apiResponse(200, {accessToken, refreshToken: newRefreshToken}, "Access token refresh successfully"))
  } catch (error) {
    throw new apiError(401, error?.message || "Invalid refresh token")
  }
})
const changeUserPassword = asyncHandler(async(req,res)=>{
  const {oldPassword, newPassword} =  req.body 

  const user = await User.findById(req.user?._id)
  const isPasswordCorrect = await user.isPasswordCorrect(oldPassword)

  if(!isPasswordCorrect){
    throw new apiError(401, "Old password is incorrect")
  }
  user.password = newPassword
  await user.save({validateBeforeSave: false})
  return res.status(200).json(new apiResponse(200,{}, "password changed successully"))
})
const getCurrentUser = asyncHandler(async(req, res) => {
    return res.status(200).json(200, req.user, "Current user fetch successfully")
})
const updateAccountDetails = asyncHandler(async(req, res) => {
    const {fullname, username} = req.body
    if(!(fullname || username)){
      throw new apiError(400, "Please fill in all fields")
    }
    const user = await User.findByIdAndUpdate(
      req.user?._id,
    {
      $set:{
        fullname,
        username
      }
    },
    {new: true}
    ).select("-password")
    res.status(200).json(new apiResponse(200, user, "Account detailed updated successfully"))
})

const updateUserAvatar = asyncHandler(async(req, res) => {
      const avatarLocalPath = req.file?.path
      if(!avatarLocalPath){
        throw new apiError(400, "Please upload a valid image")
      }
      const avatar = await cloudinaryFileUploader(avatarLocalPath)
      if(!avatar.url){
          throw new apiError(404,"Error on uploading avatar")
      }
      await User.findByIdAndUpdate(
        req.user?._id,
        {
          $set:{
            profilePicture:avatar.url
          }  
        },
        {new: true}
      ).select("-password")
      return res.status(200).json(new apiResponse(200, user, "updated the Profile Picture"))
})    
export {registerUser,loginUser, logoutUser, refreshAccessToken, changeUserPassword, getCurrentUser, updateAccountDetails, updateUserAvatar}
