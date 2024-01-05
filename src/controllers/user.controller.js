import { asyncHandler } from "../utils/asyncHandler.js";
import { apiError } from "../utils/apiError.js";
import { User } from "../models/user.model.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import { apiResponse } from "../utils/apiResponse.js";
const registerUser = asyncHandler(async (req, res) => {
  const { fullName, email, username, password } = req.body;
  //console.log("Here is email", email);

  if (
    [fullName, email, username, password].some((field) => field?.trim() === "")
  ) {
    throw new apiError(400, "all fields are required");
  }

  const existedUser = User.findOne({
    //database a username and email exitst kore kina
    $or: [{ username }, { email }],
  });

  if (existedUser) {
    throw new apiError(409, "username or email already exist");
  }
  const avatarLocalPath = req.files?.avatar[0]?.path;
  const coverImageLocalPath = req.files?.coverImage[0]?.path;

  if (!avatarLocalPath) {
    throw new apiError(400, "Avatar is reqired");
  }

  const avatar = await uploadOnCloudinary(avatarLocalPath);
  const coverImage = await uploadOnCloudinary(coverImageLocalPath);

  if (!avatar) {
    throw new apiError(400, "Avatar is required");
  }

  const user = User.create({
    fullName,
    avatar: avatar.url,
    coverImage: coverImage.url || " ",
    email,
    password,
    username: username.toLowerCase(),
  });
  const createUser = await User.findById(user._id).select(
    "-password -refreshToken"
  );

  if (!createUser) {
    throw new apiError(500, "Something went Wrong while registering the user");
  }
  return res
    .status(201)
    .json(new apiResponse(200, createUser, "user registred successfully"));
});

export { registerUser };

//get user details from frontend => use postman
//validation=> not empty
//check if user allready exitst => username or emails
//check for images and avatar
//uplode them cloudinary
//create user object => create entry in db
//remove password and refresh token form response
//check for user creation
//return
