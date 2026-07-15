const User = require("../auth/user.model");

const sendFriendRequest = async (req, res) => {
  const senderId = req.user.userId;

  const receiverId = req.params.userId;

  if (senderId == receiverId) {
    return res.status(400).json({
      success: false,
      message: "You cannot send a friend request to yourself",
    });
  }

  const receiver = await User.findById(receiverId);

  if (!receiver) {
    return res.status(404).json({
      success: false,
      message: "User not found",
    });
  }

  const alreadySent = receiver.friendRequests.includes(senderId);

  if (alreadySent) {
    return res.status(400).json({
      success: false,
      message: "Friend request already sent",
    });
  }

  receiver.friendRequests.push(senderId);

  await receiver.save();

  return res.status(200).json({
    success: true,
    message: "Friend request sent successfully",
  });
};

const getFriendRequests = async (req, res) => {
  const userId = req.user.userId;

  const user = await User.findById(userId).populate(
    "friendRequests",
    "name email profilePicture",
  );

  return res.status(200).json({
    success: true,
    data: user.friendRequests,
  });
};

module.exports = {
  sendFriendRequest,
  getFriendRequests,
};
