import axios from "axios";
import { useState, useRef } from "react";

export function useFriendsStatus(friends, setFriends, user) {
  const [showFriendsStatus, setShowFriendsStatus] = useState(false);
  const [friendMessage, setFriendMessage] = useState("");
  const [activeFriendMessage, setActiveFriendMessage] = useState(null);
  const timeoutRef = useRef([]);

  const addDeleteFriend = async (id) => {
    if (id === user) return;
    try {
      const response = await axios.put(
        `http://localhost:5000/un/users/friends-control/${id}`,
        {},
        { withCredentials: true }
      );

      if (response.status === 200) {
        const getNewStatus = (currentStatus) => {
          switch (currentStatus) {
            case "friends":
              return {
                msg: "Користувача видалено зі списку друзів",
                newStatus: "requestReceived",
              };

            case "requestSent":
              return { msg: "Запит дружби скасовано", newStatus: "none" };

            case "requestReceived":
              return {
                msg: "Користувача прийнято в друзі",
                newStatus: "friends",
              };

            default:
              return {
                msg: "Запит на дружбу надіслано",
                newStatus: "requestSent",
              };
          }
        };

        let msg = "";
        if (Array.isArray(friends)) {
          let result;
          setFriends((prev) =>
            prev.map((friend) => {
              if (String(friend._id) === String(id)) {
                result = getNewStatus(friend?.status);
                msg = result.msg;
                setActiveFriendMessage(id);
                setFriendMessage(msg);
                return { ...friend, status: result.newStatus };
              }
              return friend;
            })
          );
        } else {
          const result = getNewStatus(friends?.status);
          msg = result.msg;
          setFriends((prev) => ({ ...prev, status: result.newStatus }));
          setFriendMessage(msg);
        }

        setFriendMessage(msg);
        setShowFriendsStatus(true);

        timeoutRef.current.forEach(clearTimeout);
        timeoutRef.current = [];
        const fadeOutTimeout = setTimeout(
          () => setShowFriendsStatus("out"),
          4000
        );
        const hideTimeout = setTimeout(() => setShowFriendsStatus(false), 4800);

        timeoutRef.current.push(fadeOutTimeout, hideTimeout);
      }
    } catch (error) {
      console.log(
        "Server error:",
        error.response ? error.response.data : error.message
      );
    }
  };

  const getButtonText = (friendStatus) => {
    switch (friendStatus) {
      case "friends":
        return "Видалити з друзів";
      case "requestSent":
        return "Скасувати запит в друзі";
      case "requestReceived":
        return "Підтвердити запит на дружбу";
      default:
        return "Додати в друзі";
    }
  };

  return {
    addDeleteFriend,
    getButtonText,
    showFriendsStatus,
    setShowFriendsStatus,
    friendMessage,
    setFriendMessage,
    activeFriendMessage,
  };
}
