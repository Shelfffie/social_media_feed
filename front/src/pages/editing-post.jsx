import { useState, useEffect } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useAuth } from "../auth-hook";
import styles from "../css/postPage.module.css";
import create from "../css/createPost.module.css";
import { usePostInfo } from "../hooks/get-a-single-post";
import { usePostChanger } from "../hooks/control-post-editing";

function EditPostPage() {
  const { id } = useParams();
  const { post, setPost, isLoading } = usePostInfo(id);
  const { isLoggedIn, user } = useAuth();
  const { register, handleSubmit, errors, saveEditPost, deletePost, setValue } =
    usePostChanger(id, post, setPost, user);
  const navigate = useNavigate();

  useEffect(() => {
    if (isLoading && post && user) {
      if (post.ownerId?._id?.toString() !== user.toString()) {
        navigate(`/post/${id}`);
      }
    }
  }, [post, user, navigate, id]);

  useEffect(() => {
    if (post) {
      setValue("title", post.title);
      setValue("content", post.content);
    }
  }, [post, setValue]);

  if (isLoading || !post) {
    return <h1>Loading...</h1>;
  }

  return (
    <form onSubmit={handleSubmit((data) => saveEditPost(data, id))}>
      <div className={styles.page}>
        <div className={styles.post}>
          <div className={create.editingPage}>
            <p>Заголовок:</p>
            <input
              {...register("title", {
                required: "Поле повинно бути заповненим!",
                minLength: {
                  value: 1,
                  message: "Повинен бути хочаби 1 символ!",
                },
                validate: (value) =>
                  value.trim() !== "" || "Поле повинно містити символи!",
              })}
              type="text"
              placeholder="Заголовок"
              className={create.textareaEditing}
            />
            <p className="errorText">{errors.title?.message}</p>
            <p>Контент:</p>
            <textarea
              {...register("content", {
                required: "Поле повинно бути заповненим!",
                minLength: {
                  value: 2,
                  message: "Повинно бути хочаби 2 символи!",
                },
                validate: (value) =>
                  value.trim() !== "" || "Поле повинно містити символи!",
              })}
              cols="30"
              rows="10"
              placeholder="Вміст"
              className={create.textareaEditing}
            />
            <p className="errorText">{errors.content?.message}</p>
            {post?.images.length !== 0 && (
              <div className={styles.imageBox}>
                {" "}
                {post?.images?.map((path, index) => (
                  <img
                    key={index}
                    src={`http://localhost:5000${path}`}
                    alt=""
                  />
                ))}{" "}
              </div>
            )}
            <button
              className={`${create.inputFileButton} ${create.formButton}`}
              style={{ border: "none" }}
              type="submit"
            >
              Зберегти
            </button>
            <button
              onClick={() => navigate(`/post/${id}`, { replace: true })}
              className={`${create.inputFileButton} ${create.formButton}`}
              style={{ border: "none" }}
              type="button"
            >
              Відмінити
            </button>

            <button
              onClick={() => deletePost(id)}
              className={`${create.inputFileButton} ${create.formButton}`}
              style={{ border: "none" }}
              type="button"
            >
              Видалити
            </button>
          </div>
        </div>
      </div>
    </form>
  );
}

export default EditPostPage;
