const { success } = require("zod");
const User = require("./user.model");

const profile = async (req, res) => {
  const user = await User.findById(req.user.userId).select("-password");

  if (!user) {
    return res.status(404).json({
      success: false,
      message: "User not found",
    });
  }

  const responseUser = {
    id: user.id,
    name: user.name,
    email: user.email,
    age: user.age,
    gender: user.gender,
    bio: user.bio,
    profilePicture: user.profilePicture,
    isOnline: user.isOnline,
    createdAt: user.createdAt,
    updatedAt: user.updatedAt,
  };

  return res.status(200).json({
    success: true,
    data: responseUser,
  });
};

module.exports = { profile };
