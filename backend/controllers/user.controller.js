import User from "../models/user.model.js";
import { generateProfilePic } from "../utils/profilePic.js";

export const getUsersForSidebar = async (req, res) => {
  try {
    const loggedInUserId = req.user._id;

    const filteredUsers = await User.find({
      _id: { $ne: loggedInUserId },
    }).select("-password");

    await Promise.all(
      filteredUsers.map(async (user) => {
        const profilePic = generateProfilePic(user.username, user.gender);
        if (user.profilePic !== profilePic) {
          user.profilePic = profilePic;
          await user.save();
        }
      }),
    );

    res.status(200).json(filteredUsers);
  } catch (error) {
    console.error("Error in getUsersForSidebar: ", error.message);
    res.status(500).json({ error: "Internal server error" });
  }
};
