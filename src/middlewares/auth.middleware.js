import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import jwt from "jsonwebtoken";
import { User } from "../models/user.model.js";



export const verifyJWT = asyncHandler( async(req, _ ,next) => {
   try {
        const token = req.cookies?.accessToken || req.header("Authorization")?.replace("Bearer", "")
        // console.log("The Req in line 11 middleware is",req);
    
        if(!token) {
            throw new ApiError(401, "Unauthorized Request");
        }
    
        const decodeedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET)
    
        const user = await User.findById(decodeedToken?._id).select("-password -refreshToken")
        // console.log("The user find by verifyJWT middleer",user);
    
        if (!user) {
            throw new ApiError(401, "Invalid Access Token");
        }
    
        req.user = user;
        next();
   } catch (error) {
        throw new ApiError(401, error.message || "Invalid Access Token")
   }
})
