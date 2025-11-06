import { useAuth } from "../auth-hook";
import { useNavigate, Link } from "react-router-dom";
import { useFriendsStatus } from "../hooks/control-friends";
import { useFriendsList } from "../hooks/get-friends";
import profile from "../css/profile.module.css";

function Friends({ type }) {
  const { loading, user } = useAuth();
  const navigate = useNavigate();
  const { friends, setFriends } = useFriendsList(null, type);
  const {
    addDeleteFriend,
    getButtonText,
    showFriendsStatus,
    friendMessage,
    activeFriendMessage,
  } = useFriendsStatus(friends, setFriends, user);

  if (loading) {
    return <h1>Loading...</h1>;
  }

  if (!friends) {
    return <h1>Loading...</h1>;
  }

  const typeTitle = {
    friends: {
      title: "Список друзів",
      links: {
        "Отримані запити": "/received-requests",
        "Надіслані запити": "/sended-requests",
      },
    },
    "sended-requests": {
      title: "Надіслані запити в друзі",
      links: {
        Друзі: "/my-friends",
        "Отримані запити": "/received-requests",
      },
    },
    "received-requests": {
      title: "Отримані запити в друзі",
      links: {
        "Надіслані запити": "/sended-requests",
        Друзі: "/my-friends",
      },
    },
  };

  return (
    <>
      <div className={profile.friendsListPage}>
        <div className={profile.navigation}>
          <p onClick={() => navigate(-1)} className="aLink">
            Повернутися
          </p>

          {Object.entries(typeTitle[type]?.links || {}).map(([label, url]) => (
            <Link key={url} to={url} className="aLink">
              {label}
            </Link>
          ))}
        </div>

        <h1 className="titleForProfilePages">
          {typeTitle[type]?.title || "Список друзів:"}
        </h1>
        {friends?.length === 0 || !friends ? (
          <p className="titleForProfilePages">У вас поки немає друзів</p>
        ) : (
          <ul>
            {friends?.map((friend, id) => (
              <li key={id} className={profile.friendItem}>
                <Link to={`/user/${friend._id}`} className="aLink">
                  Перейті на профіль
                </Link>

                <strong>{friend.name}</strong>
                <div className={profile.friendContainer}>
                  <button
                    onClick={() => addDeleteFriend(friend._id)}
                    className={profile.addFriendButton}
                  >
                    {getButtonText(friend.status)}
                  </button>

                  {showFriendsStatus && activeFriendMessage === friend._id && (
                    <p
                      className={`${profile.friendMessage}
                    ${
                      showFriendsStatus === "out"
                        ? profile.fadeOut
                        : profile.fadeIn
                    }`}
                    >
                      {friendMessage}
                    </p>
                  )}
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </>
  );
}

export default Friends;
