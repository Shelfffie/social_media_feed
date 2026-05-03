import User from "../schemas/userDB.js";

export const getUserById = async (req, res, id, isAnotherUser = false) => {
  const user = await User.findById(id).select(
    "name email friends friendsRequest friendsRequestfromUsers avatar"
  );

  let status = "none";

  if (isAnotherUser && req.signedCookies.user) {
    const currentUser = await User.findById(req.user.id).select(
      "friends friendsRequest friendsRequestfromUsers"
    );

    if (currentUser.friends.includes(id)) status = "friends";
    else if (currentUser.friendsRequest.includes(id)) status = "requestSent";
    else if (currentUser.friendsRequestfromUsers.includes(id))
      status = "requestReceived";
  }

  const userObj = user.toObject();

  userObj.status = status;

  return { user: userObj };
};
