const User = require("../auth/user.model");
const { updateProfileSchema } = require("./profile.validation");

const getProfile = async (req, res) => {
  const user = await User.findById(req.user.userId).select("-password -__v");

  return res.status(200).json({
    success: true,
    data: user,
  });
};

const updateProfile = async (req, res) => {
  const validationResult = updateProfileSchema.safeParse(req.body);

  if (!validationResult.success) {
    return res.status(400).json({
      success: false,
      errors: validationResult.error.flatten().fieldErrors,
    });
  }

  const user = await User.findByIdAndUpdate(
    req.user.userId,
    validationResult.data,
    {
      new: true,
    },
  );

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
  };

  return res.status(200).json({
    success: true,
    message: "Profile updated successfully",
    data: responseUser,
  });
};

module.exports = {
  getProfile,
  updateProfile,
};
