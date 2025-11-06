import { useAuth } from "../auth-hook";
import { Navigate, useParams } from "react-router-dom";

import { useUserInfo } from "../hooks/getUserHook";
import { DisplayPosts } from "../components/display-posts";
import { useIntersectionObserverPostsAndPosts } from "../hooks/intersection-observer";
import profile from "../css/profile.module.css";
import { useFriendsStatus } from "../hooks/control-friends";

function OtherUserProfile() {
  const { id } = useParams();
  const { isLoggedIn, user, loading } = useAuth();
  const { data, setData } = useUserInfo(id);
  const { loaderRef, posts, setFilters, filters, isLoading } =
    useIntersectionObserverPostsAndPosts(null, id);
  const { addDeleteFriend, getButtonText, showFriendsStatus, friendMessage } =
    useFriendsStatus(data, setData, user);

  if (id === user) {
    return <Navigate to="/profile" replace />;
  }

  if (loading || !data) {
    return <h1>Loading...</h1>;
  }

  return (
    <>
      <div className={profile.profilePage}>
        <div className={profile.infoBox}>
          <div className={profile.nameetc}>
            <h1>Користувач:</h1>
            <strong>{data?.name}</strong>
          </div>
          {isLoggedIn && (
            <div className={profile.friendContainer}>
              <button
                onClick={() => addDeleteFriend(id)}
                className={profile.addFriendButton}
              >
                {getButtonText(data.status)}
              </button>

              {showFriendsStatus && (
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
          )}
        </div>
      </div>
      <h1 style={{ width: "100%", textAlign: "center", marginTop: "30px" }}>
        Публікації:
      </h1>
      <DisplayPosts
        posts={posts}
        loaderRef={loaderRef}
        setFilters={setFilters}
        filters={filters}
        isLoading={isLoading}
      />
    </>
  );
}
export default OtherUserProfile;
