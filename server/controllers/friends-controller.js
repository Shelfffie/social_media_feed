import User from "../userDB.js";
const addOrDeleteFriend = (id, userId, user, newFriend) => {
  if (!id) {
    return {
      success: false,
      code: 404,
      message: "Такого користувача не існує.",
    };
  }

  if (!user) {
    return {
      success: false,
      code: 404,
      message: "Користувача з вашим id не знайдено.",
    };
  }

  if (!newFriend) {
    return {
      success: false,
      code: 404,
      message: `Користувача з id ${id} не знайдено.`,
    };
  }

  if (user._id === userId) {
    return {
      success: false,
      code: 400,
      message: "Не можна додати/видалити самого себе",
    };
  }
  return { success: true };
};

const deleteFromBase = (
  requestSender,
  theOneWhoGetRequest,
  userId,
  id,
  field,
  field2
) => {
  requestSender[field] = requestSender[field].filter(
    (friend) => friend.toString() !== id.toString()
  );
  theOneWhoGetRequest[field2] = theOneWhoGetRequest[field2].filter(
    (requestSender) => requestSender.toString() !== userId.toString()
  );
};

const addToBase = (
  requestSender,
  theOneWhoGetRequest,
  field1,
  field2,
  idField1,
  idField2
) => {
  requestSender[field1].push(theOneWhoGetRequest[idField1]);
  theOneWhoGetRequest[field2].push(requestSender[idField2]);
};

export const friendAddDeleteControll = async (req, res) => {
  try {
    const userId = req.user.id;
    const { id } = req.params;
    const user = await User.findById(userId);
    const newFriend = await User.findById(id);
    const result = addOrDeleteFriend(id, userId, user, newFriend);
    let message = "";
    if (!result.success) {
      return res.status(result.code).json({ message: result.message });
    }
    if (user.friends.includes(newFriend._id)) {
      deleteFromBase(user, newFriend, userId, id, "friends", "friends");
      addToBase(
        user,
        newFriend,
        "friendsRequestfromUsers",
        "friendsRequest",
        "_id",
        "_id"
      );
    } else if (user.friendsRequest.includes(newFriend._id)) {
      deleteFromBase(
        user,
        newFriend,
        userId,
        id,
        "friendsRequest",
        "friendsRequestfromUsers"
      );
      message = "Заявку в друзі видалено!";
    } else if (user.friendsRequestfromUsers.includes(newFriend._id)) {
      addToBase(user, newFriend, "friends", "friends", "_id", "_id");
      deleteFromBase(
        user,
        newFriend,
        userId,
        id,
        "friendsRequestfromUsers",
        "friendsRequest"
      );
    } else {
      addToBase(
        user,
        newFriend,
        "friendsRequest",
        "friendsRequestfromUsers",
        "_id",
        "_id"
      );
      message = "Заявку в друзі надіслано!";
    }
    await user.save();
    await newFriend.save();
    res.json({ message });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

export const getFriendsAndRequests = async (req, res, selectOpt) => {
  try {
    const currentUser = await User.findById(req.user.id)
      .select(selectOpt)
      .populate({ path: selectOpt, select: " _id name" });

    if (!currentUser) {
      return res.status(404).json("Користувача з таким id не знайдено");
    }

    let status;

    if (selectOpt === "friends") status = "friends";
    else if (selectOpt === "friendsRequest") status = "requestSent";
    else if (selectOpt === "friendsRequestfromUsers")
      status = "requestReceived";

    const friends = currentUser[selectOpt].map((friend) => {
      const friendObj = friend.toObject();
      friendObj.status = status;
      return friendObj;
    });

    res.json({ friends });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};
