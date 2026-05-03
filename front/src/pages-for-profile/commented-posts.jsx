import { useIntersectionObserverPostsAndPosts } from "../hooks/intersection-observer";
import { useAuth } from "../auth-hook";
import { useNavigate, Link } from "react-router-dom";
import styles from "../css/comments.module.css";

function PostsThatICommented() {
  const { loading } = useAuth();
  const { loaderRef, posts, isLoading } = useIntersectionObserverPostsAndPosts(
    null,
    null,
    null,
    true
  );
  const navigate = useNavigate();

  if (loading) {
    return <h1>Loading...</h1>;
  }

  const hasComments = posts?.length > 0;

  return (
    <>
      <div className={styles.commentPage}>
        <p onClick={() => navigate(-1)} className="navigate">
          Повернутися назад
        </p>
        <h1 className="titleForProfilePages">Ваші коментарі:</h1>
        <div>
          {isLoading && !hasComments ? (
            <p>Завантаження коментарів...</p>
          ) : !hasComments && !isLoading ? (
            "Ви ще не лишали коментарів"
          ) : (
            <div>
              <ul className={styles.commentList}>
                {posts?.map((post, id) => (
                  <li key={id}>
                    <Link to={`/post/${post.noteId._id}`}>
                      Перейти на пост...
                    </Link>
                    <h3>{post.content}</h3>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>
      <div ref={loaderRef} style={{ height: "50px" }} />
    </>
  );
}

export default PostsThatICommented;
