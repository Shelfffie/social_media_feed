import { Link } from "react-router-dom";
import { useLikes } from "../hooks/set-like";
import { useAuth } from "../auth-hook";
import styles from "../css/post-feed.module.css";

export function DisplayPosts({
  posts,
  loaderRef,
  setFilters,
  filters,
  isLoading,
  setPosts,
}) {
  const hasPosts = posts?.length > 0;
  const isFiltered = filters.title.trim().length > 0;
  const { setUnsetLike } = useLikes(setPosts, null);
  const { isLoggedIn } = useAuth();

  return (
    <>
      <div className={styles.feed}>
        <div className={styles.filter}>
          {" "}
          <h3>Знайти за назвою:</h3>
          <input
            id="title"
            type="text"
            placeholder="Введіть текст..."
            value={filters.title}
            onChange={(e) => setFilters({ ...filters, title: e.target.value })}
          />
        </div>
        <div className={styles.postsFeedElement}>
          {isLoading && !hasPosts ? (
            <p>Завантаження постів...</p>
          ) : !hasPosts && !isLoading && isFiltered ? (
            "Постів за фільтром немає"
          ) : !hasPosts && !isLoading ? (
            "Постів поки немає"
          ) : (
            <ul className={styles.postList}>
              {posts?.map((post, id) => (
                <li key={id} className={styles.postContent}>
                  <Link
                    to={`/post/${post._id}`}
                    className={styles.titlePostLink}
                  >
                    {post.title}
                  </Link>

                  <p className={styles.postTextContent}>{post.content}</p>
                  <div className={styles.imagesBox}>
                    {post?.images?.map((path, index) => (
                      <img
                        key={index}
                        src={`http://localhost:5000${path}`}
                        alt=""
                        className={styles.image}
                      />
                    ))}
                  </div>

                  <div className={styles.creatorDiv}>
                    <Link
                      to={`/user/${post?.ownerId?._id}`}
                      className={styles.userLink}
                    >
                      {post?.ownerId?.name}
                    </Link>
                    <div className={styles.likesInfo}>
                      <p>Коментарі: {post?.comments?.length} </p>
                      <div>
                        <p>{post.totalLikes}</p>
                        {!isLoggedIn && <p className={styles.likeP}>♥</p>}
                        {isLoggedIn &&
                          (post?.isLiked ? (
                            <button
                              onClick={() => setUnsetLike(post._id)}
                              className={styles.likeButton}
                            >
                              ♥
                            </button>
                          ) : (
                            <button
                              onClick={() => setUnsetLike(post._id)}
                              className={styles.likeButton}
                            >
                              ♡
                            </button>
                          ))}
                      </div>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
      <div ref={loaderRef} style={{ height: "50px" }} />
    </>
  );
}
