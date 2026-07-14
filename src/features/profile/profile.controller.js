const User = require("../auth/user.model");
const { updateProfileSchema } = require("./profile.validation");

const getProfile = async (req, res) => {
  const user = await User.findById(req.user.userId);

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
      returnDocument: "after",
    },
  );

  if (!user) {
    return res.status(404).json({
      success: false,
      message: "User not found",
    });
  }

  return res.status(200).json({
    success: true,
    message: "Profile updated successfully",
    data: user,
  });
};

const uploadProfilePicture = async (req, res) => {
  if (!req.file) {
    return res.status(400).json({
      success: false,
      message: "Please upload an image",
    });
  }

  const user = await User.findByIdAndUpdate(
    req.user.userId,
    {
      profilePicture: `/uploads/${req.file.filename}`,
    },
    {
      returnDocument: "after",
    },
  );

  return res.status(200).json({
    success: true,
    message: "Profile picture uploaded successfully",
    data: user,
  });
};

module.exports = {
  getProfile,
  updateProfile,
  uploadProfilePicture,
};
