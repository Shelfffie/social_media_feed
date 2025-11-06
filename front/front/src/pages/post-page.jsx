import axios from "axios";
import { useState, useEffect } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { PostCommentHook } from "../hooks/post-comment";
import { useAuth } from "../auth-hook";
import { useLikes } from "../hooks/set-like";
import styles from "../css/postPage.module.css";
import forBtn from "../css/post-feed.module.css";
import PhotoModal from "../components/photo-displayer";

function PostPage() {
  const navigate = useNavigate();
  const { id } = useParams();
  const [post, setPost] = useState();
  const [isLoading, setIsLoading] = useState();
  const { handleCommentChange, addCommentSubmit, comment } = PostCommentHook(
    null,
    setPost
  );
  const { isLoggedIn } = useAuth();
  const [likes, setLikes] = useState();
  const { setUnsetLike } = useLikes(null, setPost);
  const [showPhoto, setShowPhoto] = useState(false);
  const [urlPhoto, setUrlPhoto] = useState(null);

  useEffect(() => {
    if (isLoading) return;
    setIsLoading(true);
    const getPost = async () => {
      try {
        const response = await axios.get(
          `http://localhost:5000/un/post/${id}`,
          { withCredentials: true }
        );
        setPost(response.data);
        setLikes(response.data.likes.length);
      } catch (error) {
        if (error.response.status === 404 || error.response.status === 400) {
          navigate("/post/invalid");
        } else {
          console.log(
            "Server error",
            error.response ? error.response.data : error.message
          );
        }
      } finally {
        setIsLoading(false);
      }
    };
    getPost();
  }, [id, navigate]);

  if (isLoading) {
    return <h1>Loading...</h1>;
  }

  return (
    <div className={styles.page}>
      <div className={styles.return}>
        <Link>
          <p onClick={() => navigate(-1)}> Повернутися</p>
        </Link>
      </div>
      <div className={styles.post}>
        {" "}
        <div className={styles.textBox}>
          <h1>{post?.title}</h1>
          <p>{post?.content}</p>
          {post?.images.length !== 0 && (
            <div className={styles.imageBox}>
              {" "}
              {post?.images?.map((path, index) => (
                <img
                  key={index}
                  src={`http://localhost:5000${path}`}
                  alt=""
                  onClick={() => {
                    setShowPhoto(true);
                    setUrlPhoto(`http://localhost:5000${path}`);
                  }}
                  className={styles.photo}
                />
              ))}{" "}
            </div>
          )}
        </div>
        {showPhoto && (
          <PhotoModal photoUrl={urlPhoto} setShowPhoto={setShowPhoto} />
        )}
        <div className={styles.likesAutor}>
          <div>
            <p> Автор:</p>
            <Link to={`/user/${post?.ownerId?._id}`}>
              <strong> {post?.ownerId?.name}</strong>
            </Link>
          </div>
          <div>
            {" "}
            <p>Вподобайки: {likes}</p>
            {isLoggedIn &&
              (post?.isLiked ? (
                <button
                  onClick={() => setUnsetLike(id)}
                  className={forBtn.likeButton}
                >
                  ♥
                </button>
              ) : (
                <button
                  onClick={() => setUnsetLike(id)}
                  className={forBtn.likeButton}
                >
                  ♡
                </button>
              ))}
          </div>
        </div>
      </div>
      <div className={styles.post}>
        <h3>Коментарі:</h3>
        <div className={styles.commentsBox}>
          {isLoggedIn && (
            <div className={styles.sendComments}>
              <strong>Написати коментар</strong>
              <br />
              <form onSubmit={(e) => addCommentSubmit(e, id)}>
                <input
                  type="text"
                  placeholder="Add comment"
                  value={comment[id] || ""}
                  onChange={(e) => handleCommentChange(id, e.target.value)}
                />{" "}
                <button>.</button>
              </form>
            </div>
          )}

          <div className={styles.usersComments}>
            {post?.comments?.length === 0 ? (
              <strong className={styles.noComments}>
                Коментарів поки немає
              </strong>
            ) : (
              <ul>
                {post?.comments.map((comment, id) => (
                  <li key={id}>
                    <strong
                      onClick={() =>
                        navigate(`/user/${comment?.creatorId._id}`)
                      }
                    >
                      {comment?.creatorId?.name}
                    </strong>

                    <p>{comment?.content}</p>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default PostPage;
