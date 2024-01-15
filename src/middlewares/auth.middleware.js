import { User } from "../models/user.model.js";
import { apiError } from "../utils/apiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import jwt from "jsonwebtoken";

export const verifyJWT = asyncHandler(async (req, res, next) => {
  try {
    const token =
      req.cookies?.accessToken ||
      req.header("Authorization")?.replace("Bearer", "");
      console.log(token);
      
    if (!token) {
      throw new apiError(401, "Unauthorize requiest");
    }
    const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
    const user = await User.findById(decodedToken?._id).select(
      "-password -refreshToken"
    );
    if (!user) {
      throw new apiError(401, "invalid Access Token");
    }
    req.user = user;
    next();
  } catch (error) {
    throw apiError(401, error?.message || "invalid Access token");
  }
});
