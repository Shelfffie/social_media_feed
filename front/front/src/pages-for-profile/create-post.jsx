import { useCreatePost } from "../hooks/create-post";
import { useNavigate } from "react-router-dom";
import styles from "../css/createPost.module.css";

function CreatePostPage() {
  const { register, handleSubmit, onSubmit, errors } = useCreatePost();
  const navigate = useNavigate();
  return (
    <div className={styles.createPage}>
      <p onClick={() => navigate(-1)} className="navigate">
        Повернутися
      </p>

      <h1 className="titleForProfilePages">Опублікувати пост:</h1>

      <form
        onSubmit={handleSubmit(onSubmit)}
        encType="multipart/form-data"
        className={styles.sendForm}
      >
        <p>Title:</p>
        <input
          {...register("title", {
            required: "Поле повинно бути заповненим!",
            minLength: { value: 1, message: "Повинен бути хочаби 1 символ!" },
            validate: (value) =>
              value.trim() !== "" || "Поле повинно містити символи!",
          })}
          type="text"
          placeholder="Заголовок"
          className={styles.infoInput}
        />
        <p className="errorText">{errors.title?.message}</p>
        <p>Content:</p>
        <textarea
          {...register("content", {
            required: "Поле повинно бути заповненим!",
            minLength: { value: 2, message: "Повинно бути хочаби 2 символи!" },
            validate: (value) =>
              value.trim() !== "" || "Поле повинно містити символи!",
          })}
          cols="30"
          rows="10"
          placeholder="Вміст"
          className={styles.infoInput}
        ></textarea>
        <p className="errorText">{errors.content?.message}</p>
        <input
          {...register("images", {
            validate: {
              fileSize: (files) =>
                !files?.length ||
                Array.from(files).every((file) => file.size <= 5_000_000) ||
                "Файл занадто великий!",
              fileType: (files) =>
                Array.from(files).every((file) =>
                  ["image/jpeg", "image/png"].includes(file.type)
                ) || "Дозволені типи: JPG або PNG!",
            },
          })}
          type="file"
          id="fileInput"
          style={{ display: "none" }}
          multiple
        />
        <button
          onClick={() => document.getElementById("fileInput").click()}
          className={styles.inputFileButton}
          type="button"
        >
          Завантажити фото
        </button>
        <p className="errorText">{errors.images?.message}</p>

        <button type="submit" style={{ border: "none" }}>
          Створити
        </button>
      </form>
    </div>
  );
}

export default CreatePostPage;
