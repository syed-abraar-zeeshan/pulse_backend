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

const acceptFriendRequest = async (req, res) => {
  const currentUserId = req.user.userId;

  const senderId = req.params.userId;

  const currentUser = await User.findById(currentUserId);
  const sender = await User.findById(senderId);

  if (!currentUser || !sender) {
    return res.status(404).json({
      success: false,
      message: "User not found",
    });
  }

  // Remove request
  currentUser.friendRequests.pull(senderId);

  // Add both users as friends
  currentUser.friends.push(senderId);

  sender.friends.push(currentUserId);

  // Save changes
  await currentUser.save();

  await sender.save();

  return res.status(200).json({
    success: true,
    message: "Friend request accepted successfully",
  });
};

const rejectFriendRequest = async (req, res) => {
  const currentUserId = req.user.userId;
  const senderId = req.params.userId;

  const currentUser = await User.findById(currentUserId);

  if (!currentUser) {
    return res.status(404).json({
      success: false,
      message: "User not found",
    });
  }

  // Remove the pending request
  currentUser.friendRequests.pull(senderId);

  await currentUser.save();

  return res.status(200).json({
    success: true,
    message: "Friend request rejected successfully",
  });
};

const getFriends = async (req, res) => {
  const userId = req.user.userId;

  const user = await User.findById(userId).populate(
    "friends",
    "name email profilePicture",
  );

  res.status(200).json({
    success: true,
    data: user.friends,
  });
};

const removeFriend = async (req, res) => {
  const currentUserId = req.user.userId;
  const friendId = req.params.userId;

  const currentUser = await User.findById(currentUserId);
  const friend = await User.findById(friendId);

  if (!currentUser || !friend) {
    return res.status(404).json({
      success: false,
      message: "User not found",
    });
  }

  currentUser.friends = currentUser.friends.filter(
    (id) => id.toString() !== friendId,
  );

  friend.friends = friend.friends.filter(
    (id) => id.toString() !== currentUserId,
  );

  await currentUser.save();

  await friend.save();

  return res.status(200).json({
    success: true,
    message: "Friend removed successfully",
  });
};

const searchUsers = async (req, res) => {
  const searchText = req.query.name;
  const currentUserId = req.user.userId;

  const users = await User.find({
    _id: { $ne: currentUserId },
    name: {
      $regex: searchText,
      $options: "i",
    },
  }).select("name email profilePicture");

  return res.status(200).json({
    success: true,
    data: users,
  });
};

const searchFriends = async (req, res) => {
  const searchText = req.query.name;
  const currentUserId = req.user.userId;

  const currentUser = await User.findById(currentUserId).populate({
    path: "friends",
    match: {
      name: {
        $regex: searchText,
        $options: "i",
      },
    },
    select: "name email profilePicture",
  });

  return res.status(200).json({
    success: true,
    data: currentUser.friends,
  });
};

module.exports = {
  sendFriendRequest,
  getFriendRequests,
  acceptFriendRequest,
  rejectFriendRequest,
  getFriends,
  removeFriend,
  searchUsers,
  searchFriends,
};
