import { asyncHandler } from "../utils/asyncHandler.js";
import { apiError } from "../utils/apiError.js";
import { User } from "../models/user.model.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import { apiResponse } from "../utils/apiResponse.js";

const genarateAccessTokenAndRefreshToken = async (userId) => {
  try {
    const user = await User.findById(userId);
    const accessToken = user.generateAccessToken();
    const refreshToken = user.generateRefreshToken();

    user.refreshToken = refreshToken;
    await user.save({ validateBeforeSave: false });

    return { accessToken, refreshToken };
  } catch (error) {
    throw new apiError(500, "Somethig Went Wrong:JWT");
  }
};

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
  //const coverImageLocalPath = req.files?.coverImage[0]?.path;

  let coverImageLocalPath;
  if (
    req.files &&
    Array.isArray(req.files.coverImage) &&
    req.files.coverImage.length > 0
  ) {
    coverImageLocalPath = req.files.coverImage[0].path;
  }

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

  //Database a info gulo create kore dau , pore eta diyei login hobe
  // mane user create holo
  const user = await User.create({
    fullname,
    username: username.toLowerCase(),
    email,
    password,
    avatar: avatar.url,
    coverImage: coverImage?.url || "",
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

const loginUser = asyncHandler(async (req, res) => {
  //Requist body theke email password nibo , post man theke nite hobe
  //username or email base login system , password must lagbei
  const { email, username, password } = req.body;

  if (!email && !username) { //req.body theke must email password nite hobe
    //nahole error throw korbo
    throw new apiError(400, "username or email is reqirded");
  }
  //ami je username or email nilam seta DB te ache kina dekhbo
  const user = await User.findOne({
    $or: [{ username }, { email }],//$or => diye ami 2 ta object find korar
  });
  
  //jodi DB te Username or email na thake Then Error throw korbo
  if (!user) {
    throw new apiError(404, "User not found");
  }
//DB te user paua gele password cheke korbo
  const isPasswordvalid = await user.isPasswordCorrect(password);
//password match na korle error throw korbo
  if (!isPasswordvalid) {
    throw new apiError(401, "Please enter currect password");
  }
  //Password thik thakle acessToken and refreshTokekn Genarate korbo
  //and user ke sent korbo
  const { refreshToken, accessToken } =
    await genarateAccessTokenAndRefreshToken(user._id);
  const logedIn = await User.findById(user._id).select(
    "password -refreshToken"
  );
//token genarate hole segulo user ke cookie'r maddhome sent korbo
  const option = {
    httpOnly: true,//server theke maintain kora jabe sudhu
    secure: true,
  };
  return res
    .status(200)
    .cookie("accessToken", accessToken, option)//access token ta cookie te dilam
    .cookie("refreshToken", refreshToken, option)//refresh token ta cookie te dilam
    .json(
      new apiResponse(
        200,
        {
          user: loginUser,
          accessToken,
          refreshToken,
        },

        "user logedIn successfully"
      )
    );

  });
  const logOutUser = async (req, res) => {
    User.findByIdAndUpdate(
      req.user._id,
      {
        $set: {
          refreshToken: undefined,
        },
      },

      {
        new: true,
      }
    );
    const option = {
      httpOnly: true,
      secure: true,
    };
    return res
      .status(200)
      .clearCookie("accessToken", option)
      .clearCookie("refreshToken", option)
      .json(new apiResponse(200, "user log out"));
  };

export { registerUser, loginUser, logOutUser };

//get user details from frontend => use postman
//validation=> not empty
//check if user allready exitst => username or emails
//check for images and avatar
//uplode them cloudinary
//create user object => create entry in db
//remove password and refresh token form response
//check for user creation
//return response........
