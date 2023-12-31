import { asyncHandler } from "../utils/asyncHandler.js";
import { apiError } from "../utils/apiError.js";
import { User } from "../models/user.model.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import { apiResponse } from "../utils/apiResponse.js";

const registerUser = asyncHandler(async (req, res) => {


  const { fullname, email, username, password } = req.body;

  // Validation check je email fullname password  empty kina....
  if (
    [fullname, email, username, password].some((field) => field?.trim() === "")
  ) {
    throw new apiError(400, "all fields are required");
  }

  //ami check korbo je database ai email or username diye kono user ace kina
  //jodi user thake tahole ami error dibo
  const existedUser = await User.findOne({
    //database a username and email exitst kore kina
    $or: [{ username }, { email }], //object er moddhe kon value check korbo
  });
  //Jodi user exist kore tahole ami error dibo
  if (existedUser) {
    throw new apiError(409, "username or email already exist");
  }

  //multer file niye server a rekhe diyese, okhne thke ami access korbo
  const avatarLocalPath = req.files?.avatar[0]?.path;
  const coverImageLocalPath = req.files?.coverImage[0]?.path;

  //jodi avatar er path na uplode hoi then error dau
  if (!avatarLocalPath) {
    throw new apiError(400, "Avatar is reqired");
  }
//cloudinary function paramiter hisbae image er path nibe... 
  const avatar = await uploadOnCloudinary(avatarLocalPath);
  const coverImage = await uploadOnCloudinary(coverImageLocalPath);

  if (!avatar) {
    throw new apiError(400, "Avatar is required");
  }

  if (!coverImage) {
    throw new apiError(400, "cover image is required");
  }

  //Database a info gulo create kore dau , pore eta diyei login hobe
  // mane user create holo
  const user =  await User.create({
    fullname,
    username: username.toLowerCase(),
    email,
    password,
    avatar: avatar.url,
    coverImage: coverImage.url ,
  });


//Databse a user find koro tarpor id pele, okhne theke password and refreshToken
//remove korbo
  const createUser = await User.findById(user._id).select(
    "-password -refreshToken"
  );

  if (!createUser) {
    throw new apiError(500, "Something went Wrong while registering the user");
  }
  // Sent response....
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
//return response........
