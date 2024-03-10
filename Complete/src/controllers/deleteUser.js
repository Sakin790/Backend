import { User } from "../models/user.model.js";
import { asyncHandler } from "../utils/asyncHandler.js";

export const deleteAllUser = asyncHandler(async (req, res) => {
  await User.deleteMany({});
  res.status(200).json({
    message: "All User deleted successfully",
  });
});
