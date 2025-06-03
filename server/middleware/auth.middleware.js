import { User } from "../models/user.model.js";
import { apiError } from "../utils/apiErrors.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import jwt from "jsonwebtoken"

export const verifyJWT = asyncHandler(async (req, res, next) =>{
   try {
    
     const token = req.cookies?.accessToken ||
      req.header("Authorization")?.replace("Bearer ", "");
      
     if (!token) {
      throw new apiError( 401,"Unauthorized: Invalid or missing token");
    }
     const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET)
        
    const user = await User.findById(decodedToken?._id).select("-password -refreshToken")
    console.log(user)
    if(!user){
     throw new apiError("Unauthorized user!!", 401)
    }
    req.user = user
    next()
   } catch (error) {
    throw new apiError(401, error?.message||"Invalid Access Token")
   }
})